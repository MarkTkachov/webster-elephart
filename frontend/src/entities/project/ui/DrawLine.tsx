import Konva from 'konva';
import { useProjectStore } from '../model/projectStore';
import { useEffect, useRef, useState } from 'react';
import { clearAllSelection } from '@/entities/project';
import { DrawLineInstrument } from '../lib/Instruments/DrawLine';

const DrawLine: React.FC = () => {
    const state = useProjectStore((state) => state.state);
    const drawState = useProjectStore((state) => state.drawState);
    const stage = useProjectStore((state) => state.stage);

    useEffect(() => {
        // const stage = useProjectStore.getState().stage;
        if (!stage) return;

        if (state === 'CreateFigure' && drawState === 'Line') {
            const instrument = new DrawLineInstrument();
            instrument.applyToStage();

            return () => {
                stage.off('pointerdown pointermove pointerup contextmenu');
                // stage.off('click', handleClick);
                // stage.off('mousemove', handleMouseMove);
                // stage.off('contextmenu', handleContextMenu);
            };
        }
    }, [state, drawState, stage]);

    return null;
};

export default DrawLine;
