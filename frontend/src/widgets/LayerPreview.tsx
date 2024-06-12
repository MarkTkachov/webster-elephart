import { clearAllSelection, useProjectStore } from '@/entities/project';
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from '@radix-ui/react-icons';
import Konva from 'konva';
import { FC, useEffect, useState } from 'react';
import { Img } from 'react-image';

const LayerPreview: FC<{ layer: Konva.Layer }> = ({ layer }) => {
    const stage = useProjectStore((state) => state.stage);
    const [shapes, setShapes] = useState<Konva.Node[] | null>(null);
    const UpdatePreview = useProjectStore((state) => state.updatePreview);
    const SelectedShape = useProjectStore((state) => state.selectedShape);
    const setUpdatePreview = useProjectStore((state) => state.setUpdatePreview);
    const setSelectedShape = useProjectStore(
        (state) => state.setSelectredShape,
    );
    const setSelectedLayer = useProjectStore((state) => state.setSelectedLayer);
    const transformer = layer.findOne('Transformer') as Konva.Transformer;
    useEffect(() => {
        const shapes = layer.find('Circle, Rect, Ellipse, Line, Text, Image');
        if (!shapes || !shapes.length) return;
        const selectedShapes = shapes.filter((shape) => {
            if (
                shape.getAttr('handdrawn') ||
                shape.hasName('_anchor') ||
                shape.hasName('guid-line')
            )
                return false;
            return true;
        });
        const sortedShapes = selectedShapes.sort(
            (a, b) => b.getZIndex() - a.getZIndex(),
        );
        // sortedShapes.map((shape, index) => {
        //     console.log(shape.getZIndex());
        // });
        setShapes(sortedShapes);
    }, [layer, UpdatePreview]);

    const handleMoveUp = (shape: Konva.Node) => {
        if (shapes && shapes.length > 0) {
            const index = shapes.indexOf(shape);
            if (index > 0) {
                const prevShape = shapes[index - 1];
                const currentZIndex = shape.getZIndex();
                const prevZIndex = prevShape.getZIndex();
                shape.setZIndex(prevZIndex);
                prevShape.setZIndex(currentZIndex);
                layer.draw();
                updateShapes();
            }
        }
    };

    const handleMoveDown = (shape: Konva.Node) => {
        if (!shapes) return;
        const index = shapes.indexOf(shape);
        if (index < shapes.length - 1) {
            const nextShape = shapes[index + 1];
            const currentZIndex = shape.getZIndex();
            const nextZIndex = nextShape.getZIndex();
            shape.setZIndex(nextZIndex);
            nextShape.setZIndex(currentZIndex);
            layer.draw();
            updateShapes();
        }
    };

    const updateShapes = () => {
        const shapes = layer.find('Circle, Rect, Ellipse, Line, Text, Image');
        const selectedShapes = shapes.filter((shape) => {
            if (
                shape.getAttr('handdrawn') ||
                shape.hasName('_anchor') ||
                shape.hasName('guid-line')
            )
                return false;
            return true;
        });

        const sortedShapes = selectedShapes.sort(
            (a, b) => b.getZIndex() - a.getZIndex(),
        );
        setShapes(sortedShapes);
    };

    return (
        <div>
            {shapes &&
                shapes.map((shape, index) => (
                    <div
                        key={index}
                        className={`${
                            shape == SelectedShape
                                ? 'bg-secondary'
                                : 'bg-background'
                        } flex justify-between`}
                        onClick={() => {
                            clearAllSelection(stage);
                            transformer.nodes([shape]);
                            setSelectedShape(shape);
                            setSelectedLayer(layer);
                        }}
                    >
                        {shape.visible() && (
                            <>
                                <div className="h-20 w-20 p-2">
                                    <img
                                        src={shape.toDataURL()}
                                        alt="preview"
                                        className="h-full w-full object-contain"
                                        style={{
                                            aspectRatio: `${
                                                shape.width() / shape.height()
                                            }`,
                                        }}
                                    />
                                </div>
                                <div className="mr-4 flex items-center gap-1">
                                    <ArrowUpIcon
                                        className="h-5 w-5 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMoveUp(shape);
                                        }}
                                    />

                                    <ArrowDownIcon
                                        className="h-5 w-5 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMoveDown(shape);
                                        }}
                                    />

                                    <TrashIcon
                                        className="h-5 w-5 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            shape.destroy();
                                            layer.draw();
                                            setUpdatePreview();
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                ))}
        </div>
    );
};

export default LayerPreview;
