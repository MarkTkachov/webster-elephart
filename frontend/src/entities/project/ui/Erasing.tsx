import Konva from 'konva';
import { Brushes, EraserBrush, useProjectStore } from '@/entities/project';
import { useEffect } from 'react';
import { getLayerCreationIndex } from '../lib/layerCreationIndex';

export const Erasing: React.FC = () => {
    const state = useProjectStore((state) => state.state);
    const stage = useProjectStore((state) => state.stage);

    useEffect(() => {
        if (state !== 'Erasing') return;
        // const stage = useProjectStore.getState().stage;
        if (!stage) return;
        const brush = new EraserBrush();
        Brushes.applyBrushToStage(stage, brush);
        return () => {
            if (!stage) return;
            stage.off('pointerdown pointermove pointerup');
        };
    }, [state, stage]);

    return null;
};
