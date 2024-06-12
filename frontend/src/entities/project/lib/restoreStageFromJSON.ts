import Konva from 'konva';
import { clearAllSelection } from './clearAllSelection';
import {
    resetLayerCreationIndex,
    setLayerCreationIndex,
} from './layerCreationIndex';
import { setBackgroundLayer } from '../ui/SelectBackground';
import { setSelectionTopLayer } from '../ui/SelectionArea';
import KonvaSnappingDemo from './SnapPositions';
import { TextInstrument } from './Instruments/Text';
import { useProjectStore } from '../model/projectStore';

export const restoreStageFromJSON = (stageJSON: string) => {
    const {
        setUpdatePreview,
        setStage,
        toggleLayersSwitch,
        setSelectedLayer,
        setState,
        addStageToHistory,
    } = useProjectStore.getState();

    //this may be unneeded
    const applyEventListenersToStage = (stage: Konva.Stage) => {
        stage.off('mousedown mouseup dragend transformend');
        stage.on('mousedown', (e) => {
            if (e.target === stage) {
                clearAllSelection(stage);
            }
        });

        stage.on('mouseup', () => {
            setUpdatePreview();
        });

        stage.on('dragend transformend', () => {
            // console.log('dragend transformend');
            setUpdatePreview();
            addStageToHistory();
        });

        // stage.on('contextmenu', (e) => {
        //     e.evt.preventDefault();
        //     if (e.target === stage) {
        //         setContextMenuVisible(false);
        //         return;
        //     }
        //     if (e.target instanceof Konva.Shape) {
        //         const shape = e.target;
        //         setCurrentShape(shape);

        //         setContextMenuPosition({
        //             x: e.evt.clientX,
        //             y: e.evt.clientY,
        //         });
        //         setContextMenuVisible(true);
        //     }
        // });
    };
    const curStage = useProjectStore.getState().stage;
    const instrumentState = useProjectStore.getState().state;
    const selectedLayerIndex = useProjectStore
        .getState()
        .selectedLayer?.getAttr('creationIndex');

    if (curStage) {
        curStage.destroy();
    }
    const container = document.getElementById('canvas');
    if (!container) return;
    resetLayerCreationIndex();
    const stage = Konva.Stage.create(stageJSON, container) as Konva.Stage;

    const lastIndex = stage.getAttr('lastLayerIndex');
    if (lastIndex) setLayerCreationIndex(lastIndex);

    // stageRef.current = stage;
    setStage(stage);
    setState(instrumentState);

    //find and aset backgroundLayer and selectionTopLayer
    const backgroundLayer = stage.findOne('#backgroundLayer') as
        | Konva.Layer
        | undefined;
    if (backgroundLayer) setBackgroundLayer(backgroundLayer);

    const selectionTopLayer = stage.findOne('#selectionTopLayer') as
        | Konva.Layer
        | undefined;
    if (selectionTopLayer) setSelectionTopLayer(selectionTopLayer);

    //add snapping lines to layers and select one as selected layer
    const layers = stage.find('Layer') as Konva.Layer[];
    let isSelectedStartLayer = false;
    for (const l of layers) {
        if (l.id() == 'backgroundLayer' || l.id() == 'selectionTopLayer')
            continue;
        if (
            !isSelectedStartLayer &&
            l.getAttr('creationIndex') == selectedLayerIndex
        ) {
            isSelectedStartLayer = true;
            setSelectedLayer(l);
        }
        new KonvaSnappingDemo(stage, l);
    }
    const applyFiltersToImage = (image: Konva.Image, attrs: any) => {
        image.filters([
            Konva.Filters.Brighten,
            Konva.Filters.Blur,
            Konva.Filters.Contrast,
            Konva.Filters.HSL,
            Konva.Filters.Pixelate,
        ]);
        // console.log(image.pixelSize());

        if (attrs.brightness !== undefined) image.brightness(attrs.brightness);
        if (attrs.blurRadius !== undefined) image.blurRadius(attrs.blurRadius);
        if (attrs.contrast !== undefined) image.contrast(attrs.contrast);
        if (attrs.hue !== undefined) image.hue(attrs.hue);
        if (attrs.saturation !== undefined) image.saturation(attrs.saturation);
        if (attrs.luminance !== undefined) image.luminance(attrs.luminance);
        if (attrs.pixelSize !== undefined) image.pixelSize(attrs.pixelSize);
        else image.pixelSize(1);

        // Применяем фильтры и обновляем слой
        image.cache();
        const layer = image.getLayer();
        if (layer) layer.batchDraw();
    };

    //restore images
    const images = stage.find('Image') as Konva.Image[];
    for (const image of images) {
        const src = image.getAttr('src');
        const attrs = image.getAttr('attrs');
        // console.log(attrs);
        const imageElement = new window.Image();
        imageElement.src = src;
        imageElement.crossOrigin = 'anonymous';
        imageElement.onload = () => {
            image.image(imageElement);
            applyFiltersToImage(image, attrs);
        };
    }

    //add event listeners to stuff
    for (const layer of layers) {
        if (
            layer.id() == 'backgroundLayer' ||
            layer.id() == 'selectionTopLayer'
        )
            continue;
        const transformer = layer.findOne('Transformer') as
            | Konva.Transformer
            | undefined;
        if (!transformer) continue;
        //circles rects and lines
        const figures = layer.find('.selectable') as Konva.Shape[];
        for (const fig of figures) {
            fig.on('dblclick', () => {
                clearAllSelection(stage);
                transformer.nodes([fig]);
                transformer.moveToTop();
                transformer.show();
                layer.batchDraw();
            });
        }
        //add event listeners to texts
        const texts = layer.find('.selectableText') as Konva.Text[];
        for (const text of texts) {
            text.on('transform', () => {
                text.setAttrs({
                    width: text.width() * text.scaleX(),
                    height: text.height() * text.scaleY(),
                    scaleX: 1,
                    scaleY: 1,
                });
            });

            text.on('dblclick', () => {
                TextInstrument.editText(text, layer, transformer);
                transformer.nodes([text]);
                transformer.show();
                layer.batchDraw();
            });
        }
    }

    toggleLayersSwitch();
    setUpdatePreview();

    applyEventListenersToStage(stage);
};
