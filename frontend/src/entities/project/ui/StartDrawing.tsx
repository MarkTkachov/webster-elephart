import Konva from 'konva';
import { PencilBrush, useProjectStore } from '@/entities/project';
import { Brushes } from '@/entities/project';
import { useEffect } from 'react';

export const StartDrawing: React.FC = () => {
    const drawState = useProjectStore((state) => state.drawState);
    const stage = useProjectStore((state) => state.stage);
    useEffect(() => {
        if (drawState !== 'Pencil') return;
        // const stage = useProjectStore.getState().stage;
        if (!stage) return;
        const brush = new PencilBrush();
        Brushes.applyBrushToStage(stage, brush);
        // layer.draw();
        return () => {
            if (!stage) return;
            stage.off('pointerdown pointermove pointerup');
        };
    }, [drawState, stage]);

    return null;
};
