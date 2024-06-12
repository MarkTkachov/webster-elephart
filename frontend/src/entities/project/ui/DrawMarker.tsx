import { Brushes, useProjectStore } from '@/entities/project';
import { useEffect } from 'react';
import { MarkerBrush } from '../lib/Instruments/MarkerBrush';

export const DrawMarker: React.FC = () => {
    const drawState = useProjectStore((state) => state.drawState);
    const stage = useProjectStore((state) => state.stage);
    useEffect(() => {
        if (drawState !== 'Marker') return;
        // const stage = useProjectStore.getState().stage;
        if (!stage) return;
        const brush = new MarkerBrush();
        Brushes.applyBrushToStage(stage, brush);
        // layer.draw();
        return () => {
            if (!stage) return;
            stage.off('pointerdown pointermove pointerup');
        };
    }, [drawState, stage]);

    return null;
};
