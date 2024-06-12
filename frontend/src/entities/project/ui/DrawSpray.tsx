import { Brushes, useProjectStore } from '@/entities/project';
import { useEffect } from 'react';
import { InkBrush } from '../lib/Instruments/InkBrush';
import { SprayBrush } from '../lib/Instruments/SprayBrush';

export const DrawSpray: React.FC = () => {
    const drawState = useProjectStore((state) => state.drawState);
    const stage = useProjectStore((state) => state.stage);
    useEffect(() => {
        if (drawState !== 'Spray') return;
        // const stage = useProjectStore.getState().stage;
        if (!stage) return;
        const brush = new SprayBrush();
        Brushes.applyBrushToStage(stage, brush);
        // layer.draw();
        return () => {
            if (!stage) return;
            stage.off('pointerdown pointermove pointerup');
        };
    }, [drawState, stage]);

    return null;
};
