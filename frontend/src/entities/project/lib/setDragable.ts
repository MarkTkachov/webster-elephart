import Konva from 'konva';
import { useProjectStore } from '../model/projectStore';

export const setOffDragable = () => {
    const stage = useProjectStore.getState().stage;
    if (!stage) return;

    stage.find('Circle, Rect, Ellipse, Line, Image').forEach((node) => {
        if (!node.getAttr('handdrawn')) node.draggable(false);
    });
};

export const setOnDragable = () => {
    const layer = useProjectStore.getState().selectedLayer;
    if (!layer) return;

    layer.find('Circle, Rect, Ellipse, Line, Image').forEach((node) => {
        if (!node.getAttr('handdrawn')) node.draggable(true);
    });
};

export const setOnDraggableLayer = (layer: Konva.Layer) => {
    layer.find('Circle, Rect, Ellipse, Line, Image').forEach((node) => {
        if (!node.getAttr('handdrawn')) node.draggable(true);
    });
};
