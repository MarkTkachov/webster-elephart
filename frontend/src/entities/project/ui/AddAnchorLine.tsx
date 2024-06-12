import Konva from 'konva';
import { useProjectStore } from '../model/projectStore';
import { useEffect } from 'react';
import { DrawCurveInstrument } from '../lib/Instruments/DrawAnchorLine';

const DrawAnchorLine: React.FC = () => {
    const state = useProjectStore((state) => state.state);
    const drawState = useProjectStore((state) => state.drawState);
    const stage = useProjectStore((state) => state.stage);

    useEffect(() => {
        // const stage = useProjectStore.getState().stage;
        if (!stage) return;

        if (state === 'CreateFigure' && drawState === 'AnchorLine') {
            const instrument = new DrawCurveInstrument();
            instrument.applyToStage();

            return () => {
                stage.off('pointerdown pointermove pointerup contextmenu');
            };
        }
    }, [state, drawState, stage]);

    return null;
};

export default DrawAnchorLine;
