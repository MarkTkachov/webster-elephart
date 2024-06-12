import { KonvaEventObject } from 'konva/lib/Node';
import { IBaseBrush } from '../brushes';
import { calculateAzimuthAngle } from '../calculateAzimuthAngle';
import { useProjectStore } from '../../model/projectStore';
import Konva from 'konva';

function calculateMarkerEdgePoints(
    x: number,
    y: number,
    angle: number,
    dist: number,
): { top: [number, number]; bottom: [number, number] } {
    const shiftX = dist * Math.cos(angle);
    const shiftY = dist * Math.sin(angle);
    return {
        top: [x + shiftX, y + shiftY],
        bottom: [x - shiftX, y - shiftY],
    };
}

export class MarkerBrush implements IBaseBrush {
    type = 'MarkerBrush';
    lastPointTop?: [number, number];
    lastPointBottom?: [number, number];
    isDrawing = false;
    onPointerDown(e: KonvaEventObject<PointerEvent>) {
        const azimuthAngle = calculateAzimuthAngle(e.evt.tiltX, e.evt.tiltY);
        const adjustedAngle = azimuthAngle - (Math.PI * 3) / 4;
        const stage = useProjectStore.getState().stage;
        const target = useProjectStore.getState().selectedLayer;
        const brushSettings = useProjectStore.getState().brushSettings;
        if (!stage || !target) return;
        const pos = stage.getRelativePointerPosition();
        if (!pos) return;
        const { top, bottom } = calculateMarkerEdgePoints(
            pos.x,
            pos.y,
            adjustedAngle,
            (brushSettings.width * e.evt.pressure) / 2,
        );
        this.lastPointTop = top;
        this.lastPointBottom = bottom;
        this.isDrawing = true;
    }
    onPointerMove(e: KonvaEventObject<PointerEvent>) {
        const azimuthAngle = calculateAzimuthAngle(e.evt.tiltX, e.evt.tiltY);
        const adjustedAngle = azimuthAngle - (Math.PI * 3) / 4;
        const stage = useProjectStore.getState().stage;
        const target = useProjectStore.getState().selectedLayer;
        const brushSettings = useProjectStore.getState().brushSettings;
        if (!stage || !target || !this.isDrawing) return;
        const pos = stage.getRelativePointerPosition();
        if (!pos) return;
        const { top, bottom } = calculateMarkerEdgePoints(
            pos.x,
            pos.y,
            adjustedAngle,
            (brushSettings.width * e.evt.pressure) / 2,
        );
        if (!this.lastPointBottom || !this.lastPointTop) {
            this.lastPointTop = top;
            this.lastPointBottom = bottom;
            return;
        }
        const newLinePolygon = new Konva.Line({
            points: [
                ...this.lastPointBottom,
                ...this.lastPointTop,
                ...top,
                ...bottom,
            ],
            closed: true,
            fill: brushSettings.color,
            stroke: brushSettings.color,
            opacity: brushSettings.opacity,
            strokeWidth: 1,
            draggable: false,
            globalCompositeOperation: 'source-over',
            shadowForStrokeEnabled: false,
            listening: false,
        });
        newLinePolygon.setAttrs({
            handdrawn: true,
        });
        target.add(newLinePolygon);

        this.lastPointTop = top;
        this.lastPointBottom = bottom;
    }
    onPointerUp(e: KonvaEventObject<PointerEvent>) {
        this.isDrawing = false;
        this.lastPointBottom = undefined;
        this.lastPointTop = undefined;
    }
}
