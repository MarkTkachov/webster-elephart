import { useEffect } from 'react';
import { useProjectStore } from '@/entities/project';
import { RectInstrument } from '../lib/Instruments/Rect';

export const AddRect: React.FC = () => {
    const state = useProjectStore((state) => state.state);
    const drawState = useProjectStore((state) => state.drawState);
    const stage = useProjectStore((state) => state.stage);
    useEffect(() => {
        // const stage = useProjectStore.getState().stage;
        if (!stage) return;

        if (state === 'CreateFigure' && drawState === 'Rect') {
            const instrument = new RectInstrument();
            instrument.applyToStage();

            return () => {
                stage.off('pointerdown pointermove pointerup');
            };
        }
    }, [state, drawState, stage]);

    return null;
};
