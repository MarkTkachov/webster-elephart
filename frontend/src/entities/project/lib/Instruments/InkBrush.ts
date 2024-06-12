import { KonvaEventObject } from 'konva/lib/Node';
import { IBaseBrush } from '../brushes';
import { calculateAzimuthAngle } from '../calculateAzimuthAngle';
import { useProjectStore } from '../../model/projectStore';
import Konva from 'konva';

function getRandomInRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

function rotate(
    center: [number, number],
    point: [number, number],
    angle: number,
): [number, number] {
    //positive angle - counterclocwise, negative - clockwise
    angle = -angle;
    const [cx, cy] = center;
    const [x, y] = point;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const nx = cos * (x - cx) + sin * (y - cy) + cx;
    const ny = cos * (y - cy) - sin * (x - cx) + cy;
    return [nx, ny];
}

function generateStartingPointsCoords(
    x: number,
    y: number,
    num: number,
    distribution: number,
): [number, number][] {
    const resArr: [number, number][] = [];
    for (let i = 0; i < num; i++) {
        const angle = getRandomInRange(0, Math.PI * 2);
        //uniform density of points with this
        //https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly
        const dist = distribution * Math.sqrt(Math.random());
        resArr.push([x + dist * Math.cos(angle), y + dist * Math.sin(angle)]);
    }
    return resArr;
}

export class InkBrush implements IBaseBrush {
    type = 'InkBrush';
    isDrawing = false;
    lastPoints?: [number, number][];
    lastRotatedPoints?: [number, number][];
    pointsNum = 7;
    lastPos?: [number, number];
    onPointerDown(e: KonvaEventObject<PointerEvent>) {
        const azimuthAngle = calculateAzimuthAngle(e.evt.tiltX, e.evt.tiltY);
        const stage = useProjectStore.getState().stage;
        const target = useProjectStore.getState().selectedLayer;
        const brushSettings = useProjectStore.getState().brushSettings;
        const pointWidth = brushSettings.width / Math.sqrt(this.pointsNum);
        if (!stage || !target) return;
        const pos = stage.getRelativePointerPosition();
        if (!pos) return;
        this.isDrawing = true;
        this.lastPos = [pos.x, pos.y];
        this.lastPoints = generateStartingPointsCoords(
            pos.x,
            pos.y,
            this.pointsNum,
            brushSettings.width / 2,
        );
        this.lastRotatedPoints = this.lastPoints.map((coord) => {
            return rotate([pos.x, pos.y], coord, azimuthAngle);
        });
        //draw starting points
        for (const point of this.lastRotatedPoints) {
            const newLine = new Konva.Line({
                stroke: brushSettings.color,
                strokeWidth: pointWidth * e.evt.pressure,
                globalCompositeOperation: 'source-over',
                opacity: brushSettings.opacity,
                // round cap for smoother lines
                lineCap: 'round',
                lineJoin: 'round',
                // add point twice, so we have some drawings even on a simple click
                points: [...point, ...point],
                shadowForStrokeEnabled: false,
                listening: false,
                draggable: false,
            });
            newLine.setAttrs({ handdrawn: true });
            target.add(newLine);
        }
    }
    onPointerMove(e: KonvaEventObject<PointerEvent>) {
        const azimuthAngle = calculateAzimuthAngle(e.evt.tiltX, e.evt.tiltY);
        const stage = useProjectStore.getState().stage;
        const target = useProjectStore.getState().selectedLayer;
        const brushSettings = useProjectStore.getState().brushSettings;
        const pointWidth = brushSettings.width / Math.sqrt(this.pointsNum);
        if (!stage || !target) return;
        const pos = stage.getRelativePointerPosition();
        if (!pos) return;
        if (
            !this.isDrawing ||
            !this.lastPos ||
            !this.lastPoints ||
            !this.lastRotatedPoints
        )
            return;
        //move points on mouse movement
        const dx = pos.x - this.lastPos?.[0];
        const dy = pos.y - this.lastPos[1];
        const movedPoints = this.lastPoints.map(
            (coord) => [coord[0] + dx, coord[1] + dy] as [number, number],
        );
        const rotatedPoints = movedPoints.map((coord) =>
            rotate([pos.x, pos.y], coord, azimuthAngle),
        );
        //draw points
        for (let i = 0; i < rotatedPoints.length; i++) {
            const rotPoint = rotatedPoints[i];
            const oldPoint = this.lastRotatedPoints[i];
            if (!oldPoint) continue;
            const newLine = new Konva.Line({
                stroke: brushSettings.color,
                strokeWidth: pointWidth * e.evt.pressure,
                globalCompositeOperation: 'source-over',
                opacity: brushSettings.opacity,

                // round cap for smoother lines
                lineCap: 'round',
                lineJoin: 'round',
                // add point twice, so we have some drawings even on a simple click
                points: [...oldPoint, ...rotPoint],
                shadowForStrokeEnabled: false,
                listening: false,
                draggable: false,
            });
            newLine.setAttrs({ handdrawn: true });
            target.add(newLine);
        }
        this.lastPos = [pos.x, pos.y];
        this.lastPoints = movedPoints;
        this.lastRotatedPoints = rotatedPoints;
    }
    onPointerUp(e: KonvaEventObject<PointerEvent>) {
        this.isDrawing = false;
        this.lastPoints = undefined;
        this.lastPos = undefined;
        this.lastRotatedPoints = undefined;
    }
}
