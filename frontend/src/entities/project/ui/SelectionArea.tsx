import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '@/entities/project';
import { SelectionAreaInstrument } from '../lib/Instruments/SelectionArea';

let selectionTopLayer: Konva.Layer | null = null;

export function setSelectionTopLayer(layer: Konva.Layer) {
    selectionTopLayer = layer;
    return selectionTopLayer;
}

export const SelectionArea: React.FC = () => {
    // const isDrawingRef = useRef(false);
    // const selectionRectRef = useRef<Konva.Rect | null>(null);
    // const layerRef = useRef<Konva.Layer | null>(null);
    // const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    //     null,
    // );
    const state = useProjectStore((state) => state.state);
    const selectedLayer = useProjectStore((state) => state.selectedLayer);
    // const setState = useProjectStore((state) => state.setState);
    const stage = useProjectStore((state) => state.stage);
    const layerSwitch = useProjectStore((state) => state.changedLayersSwitch);
    // const ignoreHandlesRef = useRef<boolean>(false);
    useEffect(() => {
        if (!stage) return;
        if (selectionTopLayer) selectionTopLayer.moveToTop();

        if (state !== 'SelectionArea') return;

        if (!selectionTopLayer) {
            selectionTopLayer = new Konva.Layer();
            selectionTopLayer.setAttrs({
                creationIndex: -1,
                hidden: true,
                selectionTopLayer: true,
                id: 'selectionTopLayer',
            });
            stage.add(selectionTopLayer);
            selectionTopLayer.moveToTop();
        }

        const instrument = new SelectionAreaInstrument(selectionTopLayer);
        // console.log(instrument.selectionTopLayer);

        instrument.applySelectToStage();

        return () => {
            stage.off('pointerup pointerdown pointermove');
        };
    }, [stage, state, selectedLayer, layerSwitch]);

    return null;
};
