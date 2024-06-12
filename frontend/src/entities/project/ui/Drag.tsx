import { FC, useEffect } from 'react';
import { useProjectStore } from '../model/projectStore';
import { DragInstrument } from '../lib/Instruments/Drag';

export const Drag: FC = () => {
    const state = useProjectStore((state) => state.state);
    const stage = useProjectStore((state) => state.stage);
    useEffect(() => {
        if (state !== 'Drag') return;
        const instrument = new DragInstrument();
        instrument.applyToStage();
    }, [state, stage]);

    return null;
};
