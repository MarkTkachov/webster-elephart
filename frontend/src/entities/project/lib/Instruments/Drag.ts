import { KonvaEventObject } from 'konva/lib/Node';
import { useProjectStore } from '../../model/projectStore';
import { IInstuments } from './types';

export class DragInstrument implements IInstuments {
    type = 'Drag';
    isDraggingStage = false;

    applyToStage() {
        const stage = useProjectStore.getState().stage;
        if (stage) {
            stage.off('pointerdown pointermove pointerup');
            stage.on('pointerdown', (e) => this.onPointerDown(e));
            stage.on('pointermove', (e) => this.onPointerMove(e));
            stage.on('pointerup', (e) => this.onPointerUp(e));
        }
    }
    onPointerDown(e: KonvaEventObject<PointerEvent>) {
        // const stage = useProjectStore.getState().stage;
        // if (!stage) return;
        // if (e.target !== stage) return;
        // this.isDraggingStage = true;
    }
    onPointerMove(e: KonvaEventObject<PointerEvent>) {
        // if (!this.isDraggingStage) return;
        // const stage = useProjectStore.getState().stage;
        // if (!stage) return;
        // const pos = stage.position();
        // if (!pos) return;
        // pos.x = pos.x + e.evt.movementX;
        // pos.y = pos.y + e.evt.movementY;
        // stage.position(pos);
    }
    onPointerUp(e: KonvaEventObject<PointerEvent>) {
        // this.isDraggingStage = false;
        // useProjectStore.getState().setUpdatePreview();
    }
}
