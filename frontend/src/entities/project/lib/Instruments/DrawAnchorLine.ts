import Konva from 'konva';
import { useProjectStore } from '../../model/projectStore';
import { setOffDragable } from '../setDragable';
import { IInstuments } from './types';
import { KonvaEventObject } from 'konva/lib/Node';
import { clearAllSelection } from '../clearAllSelection';

export class DrawCurveInstrument implements IInstuments {
    type = 'DrawCurve';
    isDrawing = false;
    points: number[] = [];
    line: Konva.Line | null = null;
    tempLine: Konva.Line | null = null;

    applyToStage() {
        const stage = useProjectStore.getState().stage;
        const setUpdatePreview = useProjectStore.getState().setUpdatePreview;
        if (stage) {
            setOffDragable();
            stage.off('pointerdown pointermove pointerup contextmenu');
            stage.on('pointerdown', (e) => {
                if (e.evt.button == 0) this.onPointerDown(e);
            });
            stage.on('pointermove', (e) => this.onPointerMove(e));
            stage.on('pointerup', (e) => this.onPointerUp(e));
            stage.on('contextmenu', (e) => this.handleContextMenu(e));
            stage.on('pointerup', () => setUpdatePreview());
            stage.on('pointerup', () =>
                useProjectStore.getState().addStageToHistory(),
            );
        }
    }

    onPointerDown(e: KonvaEventObject<PointerEvent>) {
        if (!this.points) this.points = [] as number[];
        if (e.evt.button !== 0) return;
        const stage = useProjectStore.getState().stage;
        const layer = useProjectStore.getState().selectedLayer;
        const shapeSettings = useProjectStore.getState().shapeSettings;
        if (!stage || !layer) return;
        const transformer = layer.findOne('Transformer') as Konva.Transformer;

        const pos = stage.getRelativePointerPosition();
        if (!pos) return;
        // console.log(this.points);

        const newPoints = [...this.points, pos.x, pos.y];
        // console.log(newPoints);

        if (this.line) {
            this.line.points(newPoints);
            layer.batchDraw();
        } else {
            const newLine = new Konva.Line({
                points: newPoints,
                stroke: shapeSettings.stroke,
                strokeWidth: shapeSettings.strokeWidth,
                opacity: shapeSettings.opacity,
                lineCap: 'round',
                lineJoin: 'round',
                draggable: false,
                // tension: 1,
                bezier: true,
            });

            newLine.addName('selectable');

            // newLine.on('click tap', () => {
            //     clearAllSelection(stage);
            //     transformer.nodes([newLine]);
            // });

            newLine.on('dblclick', () => {
                clearAllSelection(stage);
                transformer.nodes([newLine]);
                transformer.moveToTop();
                transformer.show();
                layer.batchDraw();
            });

            this.line = newLine;
            layer.add(newLine);
        }
        this.points = newPoints;
        this.isDrawing = true;
    }

    onPointerMove(e: KonvaEventObject<PointerEvent>) {
        if (!this.isDrawing) return;
        const stage = useProjectStore.getState().stage;
        const layer = useProjectStore.getState().selectedLayer;
        if (!stage || !layer) return;
        // const transformer = layer.findOne('Transformer') as Konva.Transformer;

        const pos = stage.getRelativePointerPosition();

        if (!pos || this.points.length < 2) return;

        const tempPoints = [...this.points, pos.x, pos.y];
        if (this.tempLine) {
            this.tempLine.points(tempPoints);
        } else {
            const newTempLine = new Konva.Line({
                points: tempPoints,
                stroke: 'red',
                strokeWidth: 2,
                dash: [4, 4], // Optional: makes the temporary line dashed
            });
            newTempLine.setAttrs({ handdrawn: true });
            layer.add(newTempLine);
            this.tempLine = newTempLine;
        }
        if (this.line) this.line.points(tempPoints);
        layer.batchDraw();
    }

    onPointerUp(e: KonvaEventObject<PointerEvent>) {
        return;
    }

    handleContextMenu(e: any) {
        if (!this.isDrawing) return;
        e.evt.preventDefault();
        this.line?.points(this.points);
        this.isDrawing = false;
        this.line = null;
        this.points = [];
        if (this.tempLine) {
            this.tempLine.destroy(); // Remove the temporary line segment
            this.tempLine = null;
        }
    }
}
