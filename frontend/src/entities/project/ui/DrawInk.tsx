import { Brushes, useProjectStore } from '@/entities/project';
import { useEffect } from 'react';
import { InkBrush } from '../lib/Instruments/InkBrush';

export const DrawInk: React.FC = () => {
    const drawState = useProjectStore((state) => state.drawState);
    const stage = useProjectStore((state) => state.stage);
    useEffect(() => {
        if (drawState !== 'Inc') return;
        // const stage = useProjectStore.getState().stage;
        if (!stage) return;
        const brush = new InkBrush();
        Brushes.applyBrushToStage(stage, brush);
        // layer.draw();
        return () => {
            if (!stage) return;
            stage.off('pointerdown pointermove pointerup');
        };
    }, [drawState, stage]);

    return null;
};
