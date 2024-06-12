import { useProjectStore } from '../model/projectStore';

let index = 0;

export function getLayerCreationIndex() {
    const stage = useProjectStore.getState().stage;
    index++;
    if (stage) stage.setAttr('lastLayerIndex', index);
    return index;
}

export function resetLayerCreationIndex() {
    index = 0;
}

export function setLayerCreationIndex(val: number) {
    index = val;
    return index;
}
