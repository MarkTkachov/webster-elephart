import Konva from 'konva';
import { useProjectStore } from '../model/projectStore';
import { setOffDragable } from './setDragable';

export interface IBaseBrush {
    type: string;
    onPointerDown: (e: Konva.KonvaEventObject<PointerEvent>) => void;
    onPointerMove: (e: Konva.KonvaEventObject<PointerEvent>) => void;
    onPointerUp: (e: Konva.KonvaEventObject<PointerEvent>) => void;
}

export class Brushes {
    static applyBrushToStage(stage: Konva.Stage, brush: IBaseBrush) {
        const setUpdatePreview = useProjectStore.getState().setUpdatePreview;
        setOffDragable();
        stage.off('pointerdown pointermove pointerup');
        stage.on('pointerdown', (e) => {
            if (e.evt.button == 0) brush.onPointerDown(e);
        });
        stage.on('pointermove', (e) => brush.onPointerMove(e));
        stage.on('pointerup', (e) => brush.onPointerUp(e));
        stage.on('pointerup', () => setUpdatePreview());

        useProjectStore
            .getState()
            .setBrushSettings({ selectedBrush: brush.type });
        stage.on('pointerup', () =>
            useProjectStore.getState().addStageToHistory(),
        );
    }
}
