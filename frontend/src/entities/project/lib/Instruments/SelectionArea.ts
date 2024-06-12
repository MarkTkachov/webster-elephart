import Konva from 'konva';
import { useProjectStore } from '../../model/projectStore';
import { setOffDragable } from '../setDragable';
import { IInstuments } from './types';

export class SelectionAreaInstrument implements IInstuments {
    type: string = 'SelectionArea';
    startPose: { x: number; y: number } | null = null;
    isDrawing: boolean = false;
    ignoreHandles = false;
    selectionRect: Konva.Rect | null = null;
    selectionTopLayer: Konva.Layer | null;
    constructor(selectionTopLayer: Konva.Layer) {
        this.selectionTopLayer = selectionTopLayer;
    }

    applySelectToStage() {
        const stage = useProjectStore.getState().stage;

        if (stage) {
            setOffDragable();
            stage.off('pointerdown pointermove pointerup');
            stage.on('pointerdown', (e) => {
                if (e.evt.button == 0) this.onPointerDown();
            });
            stage.on('pointermove', () => this.onPointerMove());
            stage.on('pointerup', () => this.onPointerUp());
        }
    }
    onPointerDown() {
        if (this.ignoreHandles) return;
        const state = useProjectStore.getState().state;
        const stage = useProjectStore.getState().stage;

        if (this.selectionRect) {
            this.selectionRect.destroy();
            this.selectionRect = null;
        }

        if (!this.selectionTopLayer || !stage) return;
        if (state !== 'SelectionArea') return;

        const pos = stage.getRelativePointerPosition();
        if (!pos) return;

        const newRect = new Konva.Rect({
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            fill: 'rgba(0, 0, 220, 0.3)',
            stroke: 'blue',
            strokeWidth: 2,
            draggable: false,
        });

        this.selectionTopLayer.add(newRect);
        this.selectionRect = newRect;
        this.startPose = pos;
        this.isDrawing = true;
    }
    onPointerMove() {
        if (this.ignoreHandles && this.isDrawing) {
            this.isDrawing = false;
            this.startPose = null;
            if (this.selectionRect) {
                this.selectionRect.destroy();
                this.selectionRect = null;
            }
        }
        if (this.ignoreHandles) return;
        const state = useProjectStore.getState().state;
        const stage = useProjectStore.getState().stage;
        if (
            state !== 'SelectionArea' ||
            !stage ||
            !this.isDrawing ||
            !this.selectionRect ||
            !this.startPose
        )
            return;

        const pos = stage.getRelativePointerPosition();
        if (!pos) return;

        const newX = Math.min(pos.x, this.startPose.x);
        const newY = Math.min(pos.y, this.startPose.y);
        const newWidth = Math.abs(pos.x - this.startPose.x);
        const newHeight = Math.abs(pos.y - this.startPose.y);

        this.selectionRect.setAttrs({
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
        });

        const layer = this.selectionTopLayer;
        if (layer) {
            layer.batchDraw();
        }
    }
    onPointerUp() {
        if (this.ignoreHandles) return;
        const state = useProjectStore.getState().state;
        const stage = useProjectStore.getState().stage;
        const selectedLayer = useProjectStore.getState().selectedLayer;
        if (
            !stage ||
            !selectedLayer ||
            !this.selectionRect ||
            state !== 'SelectionArea'
        )
            return;
        this.isDrawing = false;
        this.startPose = null;

        const shapes = selectedLayer.find('Circle, Rect, Ellipse, Line, Image');
        if (!shapes || !shapes.length) return;

        const transformer = selectedLayer?.findOne(
            'Transformer',
        ) as Konva.Transformer;

        const selectedShapes = shapes.filter((shape) => {
            if (shape.getAttr('handdrawn') || shape.hasName('_anchor'))
                return false;
            const shapeBox = shape.getClientRect();
            const selectionBox = this.selectionRect?.getClientRect();

            if (!selectionBox) return false;
            return Konva.Util.haveIntersection(shapeBox, selectionBox);
        });

        transformer.nodes(selectedShapes);
        transformer.off('transformstart stransformend');
        transformer.on('transformstart', (ev) => {
            this.ignoreHandles = true;
            this.isDrawing = false;
            this.startPose = null;
            if (this.selectionRect) {
                this.selectionRect.destroy();
                this.selectionRect = null;
            }
        });
        transformer.on('transformend', (ev) => {
            this.ignoreHandles = false;
        });

        if (this.selectionRect) {
            this.selectionRect.destroy();
        }
        this.selectionRect = null;
        selectedLayer?.batchDraw();
    }
}
