import React from 'react';
import Konva from 'konva';
import { useEffect } from 'react';
import { clearAllSelection, useProjectStore } from '@/entities/project';

export const AddImage: React.FC = () => {
    const state = useProjectStore((state) => state.state);
    const selectedImage = useProjectStore((state) => state.selectedImage);
    const setSelectedImage = useProjectStore(
        (state) => state.setSelectredImage,
    );
    // const stage = useProjectStore((state) => state.stage);
    const setUpdatePreview = useProjectStore((state) => state.setUpdatePreview);
    const addStageToHistory = useProjectStore(
        (state) => state.addStageToHistory,
    );

    useEffect(() => {
        const stage = useProjectStore.getState().stage;
        if (!stage || state !== 'SelectImage' || !selectedImage) return;

        const layer = useProjectStore.getState().selectedLayer;
        if (!layer) return;
        const transformer = layer.findOne('Transformer') as Konva.Transformer;

        const imageElement = new window.Image();
        imageElement.crossOrigin = 'anonymous';
        if (typeof selectedImage === 'string') {
            imageElement.src = selectedImage;
        } else {
            imageElement.src = (selectedImage as unknown as any).image;
        }
        // imageElement.src = (
        //     selectedImage as unknown as { image: string }
        // ).image;

        imageElement.onload = () => {
            if (!stage) return;
            let correctedWidth = imageElement.width;
            let correctedHeight = imageElement.height;
            if (correctedHeight > stage.height() * stage.scaleY()) {
                const coef =
                    correctedHeight / (stage.height() * stage.scaleY());
                correctedHeight = correctedHeight / coef;
                correctedWidth = correctedWidth / coef;
            }

            if (correctedWidth > stage.width() * stage.scaleX()) {
                const coef = correctedWidth / (stage.width() * stage.scaleX());
                correctedHeight = correctedHeight / coef;
                correctedWidth = correctedWidth / coef;
            }
            const image = new Konva.Image({
                x: 0,
                y: 0,
                width: correctedWidth,
                height: correctedHeight,
                opacity: 1,
                image: imageElement,
                draggable: true,
            });
            image.addName('selectable');

            image.setAttrs({ src: imageElement.src });

            layer?.add(image);

            image.on('click tap', () => {
                clearAllSelection(stage);
                transformer.nodes([image]);
                transformer.moveToTop();
            });

            layer?.add(transformer);
            layer?.batchDraw();
            setUpdatePreview();
            addStageToHistory();
            setSelectedImage(null);
        };
    }, [selectedImage, setUpdatePreview, state, addStageToHistory]);

    return null;
};
