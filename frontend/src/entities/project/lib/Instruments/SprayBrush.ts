import { KonvaEventObject } from 'konva/lib/Node';
import { IBaseBrush } from '../brushes';
import { useProjectStore } from '../../model/projectStore';
import Konva from 'konva';

function getRandomPointInRadius(
    x: number,
    y: number,
    radius: number,
): { x: number; y: number } {
    const angle = Math.PI * 2 * Math.random();
    //uniform density of points with this,
    //linear random distance with radial coords has more points in the center
    //https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly
    const dist = radius * Math.sqrt(Math.random());
    return { x: x + dist * Math.cos(angle), y: y + dist * Math.sin(angle) };
}

export class SprayBrush implements IBaseBrush {
    type = 'SprayBrush';
    sprayInterval?: ReturnType<typeof setInterval>;
    x = 0;
    y = 0;
    onPointerDown(e: KonvaEventObject<PointerEvent>) {
        const stage = useProjectStore.getState().stage;
        const target = useProjectStore.getState().selectedLayer;
        const brushSettings = useProjectStore.getState().brushSettings;
        if (!stage || !target) return;
        if (this.sprayInterval) clearInterval(this.sprayInterval);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const objRef = this;
        this.sprayInterval = setInterval(async () => {
            const dotPos = getRandomPointInRadius(
                objRef.x,
                objRef.y,
                brushSettings.width,
            );
            const newDot = new Konva.Rect({
                x: dotPos.x,
                y: dotPos.y,
                draggable: false,
                listening: false,
                fill: brushSettings.color,
                opacity: Math.random(),
                strokeEnabled: false,
                shadowForStrokeEnabled: false,
                height: 1,
                width: 1,
            });
            newDot.setAttrs({ handdrawn: true });
            target.add(newDot);
        }, 5);
    }
    onPointerMove(e: KonvaEventObject<PointerEvent>) {
        const stage = useProjectStore.getState().stage;
        if (!stage) return;
        const pos = stage.getRelativePointerPosition();
        if (!pos) return;
        this.x = pos.x;
        this.y = pos.y;
        return;
    }
    onPointerUp(e: KonvaEventObject<PointerEvent>) {
        if (this.sprayInterval) clearInterval(this.sprayInterval);
        this.sprayInterval = undefined;
    }
}
