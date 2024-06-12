import Konva from 'konva';
import { useEffect } from 'react';
import { useProjectStore } from '@/entities/project';
import { CircleInstrument } from '../lib/Instruments/Circle';
// import { getLayerCreationIndex } from '../lib/layerCreationIndex';

export const AddCircle: React.FC = () => {
    const state = useProjectStore((state) => state.state);
    const drawState = useProjectStore((state) => state.drawState);
    const stage = useProjectStore((state) => state.stage);

    useEffect(() => {
        // const stage = useProjectStore.getState().stage;
        if (!stage) return;
        if (state === 'CreateFigure' && drawState === 'Circle') {
            const Instrument = new CircleInstrument();
            stage.off('pointerdown pointermove pointerup');
            Instrument.applyCircleToStage();

            return () => {
                stage.off('pointerdown pointermove pointerup');
            };
        }
    }, [state, drawState, stage]);

    return null;
};
