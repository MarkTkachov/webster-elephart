import Konva from "konva";

export interface IInstuments {
    type: string;
    onPointerDown: (e: Konva.KonvaEventObject<PointerEvent>) => void;
    onPointerMove: (e: Konva.KonvaEventObject<PointerEvent>) => void;
    onPointerUp: (e: Konva.KonvaEventObject<PointerEvent>) => void;
}

