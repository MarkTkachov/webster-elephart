import { useProjectStore } from '@/entities/project';
import { FC, useMemo } from 'react';
import { LayerButton } from './LayerButton';
import Konva from 'konva';
import { getLayerCreationIndex } from '@/entities/project/lib/layerCreationIndex';
import LayerPreview from './LayerPreview';
import { ScrollArea } from '@/shared/ui/scroll-area';
import KonvaSnappingDemo from '@/entities/project/lib/SnapPositions';

export const LayersStack: FC = () => {
    const stage = useProjectStore((state) => state.stage);
    const layersSwitch = useProjectStore((state) => state.changedLayersSwitch);
    const toggleLayersSwitch = useProjectStore(
        (state) => state.toggleLayersSwitch,
    );
    const updatePreview = useProjectStore((state) => state.updatePreview);
    const layers = useMemo(
        () =>
            stage
                ?.getLayers()
                .toSorted((a, b) => b.getZIndex() - a.getZIndex()),
        [stage, layersSwitch, updatePreview],
    );

    const addLayerHandle = () => {
        const layer = new Konva.Layer();
        layer.setAttrs({ creationIndex: getLayerCreationIndex() });
        const transf = new Konva.Transformer();
        if (stage) {
            new KonvaSnappingDemo(stage, layer);
        }
        layer.add(transf);
        stage?.add(layer);
        toggleLayersSwitch();
    };

    const deleteLayerHandle = () => {
        const selectedLayer = useProjectStore.getState().selectedLayer;
        if (!selectedLayer) return;
        selectedLayer.destroy();
        toggleLayersSwitch();
    };

    return (
        <div className="flex h-full w-full flex-col overflow-auto">
            <div className="grid grid-cols-4">
                <div className="col-span-3 flex items-center pl-2 text-xl font-bold">
                    layers
                </div>
                <div className="flex w-full gap-4 text-3xl">
                    <button type="button" onClick={addLayerHandle}>
                        +
                    </button>
                    <button type="button" onClick={deleteLayerHandle}>
                        -
                    </button>
                </div>
            </div>
            <ScrollArea className="h-full pb-12">
                {layers?.map((layer, index) => (
                    <div key={layer.getAttr('creationIndex')}>
                        <LayerButton layer={layer} index={index} />
                        <LayerPreview layer={layer} />
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
};
