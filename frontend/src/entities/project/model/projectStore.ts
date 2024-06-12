import Konva from 'konva';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createProject } from '../index';
import { setOffDragable, setOnDraggableLayer } from '../lib/setDragable';
import { saveProject } from '../api/saveProject';
import { useUserStore } from '@/entities/user';
import { restoreStageFromJSON } from '../lib/restoreStageFromJSON';

interface Project {
    _id: string;
    title: string;
    width: number;
    height: number;
}

interface IBrushSettings {
    width: number;
    color: string;
    selectedBrush?: string | null;
    opacity?: number;
}

interface IShapeSettings {
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity?: number;
}

interface ITextSettings {
    fontSize: number;
    fontFamily: string;
    fill: string;
    stroke?: string;
    padding: number;
    align: string;
    fontStyle?: string;
    textDecoration?: string;
    opacity?: number;
}

interface IProjectStoreState {
    project: Project | null;
    isLoaded: boolean;
    coolDown: boolean;
    state: string;
    drawState: string;

    stage: Konva.Stage | null;
    selectedLayer: Konva.Layer | null;
    changedLayersSwitch: boolean;
    updatePreview: boolean;
    selectedShape: Konva.Node | null;

    brushSettings: IBrushSettings;
    shapeSettings: IShapeSettings;
    textSettings: ITextSettings;
    selectedImage: string | null;
    selectedBackgroundImage: string | null;
    showBackgroundColorFill: boolean;

    historyStageStack: string[];
    currentHistoryStackIndex: number;
}

interface IProjectStoreActions {
    resetStore: VoidFunction;
    setProject: (project: Project | null) => void;
    createProject: (title: string, width: number, height: number) => void;
    setState: (state: string) => void;
    setCoolDown: (state: boolean) => void;
    setDrawState: (state: string) => void;

    setStage: (stage: Konva.Stage) => void;

    setSelectredShape: (shape: Konva.Node | null) => void;
    setUpdatePreview: VoidFunction;
    setSelectredImage: (image: string | null) => void;
    setSelectedBackgroundImage: (image: string | null) => void;

    setSelectedLayer: (layer: Konva.Layer) => void;
    toggleLayersSwitch: VoidFunction;

    setBrushSettings: (settings: Partial<IBrushSettings>) => void;
    setShapeSettings: (settings: Partial<IShapeSettings>) => void;
    setTextSettings: (settings: Partial<ITextSettings>) => void;
    setShowBackgroundColorFill: (value: boolean) => void;

    saveProject: VoidFunction;

    addStageToHistory: (stageJSON?: string) => void;
    backHistory: VoidFunction;
    forwardHistory: VoidFunction;
}

const initState: IProjectStoreState = {
    project: null,
    isLoaded: false,
    coolDown: false,
    state: 'Drag',
    drawState: '',

    stage: null,
    selectedLayer: null,
    changedLayersSwitch: false,

    selectedImage: null,
    selectedBackgroundImage: null,
    selectedShape: null,
    updatePreview: false,

    brushSettings: {
        width: 10,
        color: '#000000',
        selectedBrush: null,
        opacity: 1,
    },

    shapeSettings: {
        fill: '#000000',
        stroke: '#000000',
        strokeWidth: 4,
        opacity: 1,
    },
    textSettings: {
        fontSize: 20,
        fontFamily: 'Arial',
        fill: '#000000',
        stroke: '#ff0000',
        padding: 10,
        align: 'left',
        fontStyle: 'normal',
        textDecoration: 'none',
    },
    showBackgroundColorFill: false,

    historyStageStack: [],
    currentHistoryStackIndex: 0,
};

export const useProjectStore = create<
    IProjectStoreState & IProjectStoreActions
>()(
    devtools(
        immer((set, getState) => ({
            ...initState,
            resetStore: () =>
                set((state) => ({ ...initState, project: state.project })),
            setCoolDown: (state) => set({ coolDown: state }),
            setProject: (project) => set({ project }),
            createProject: async (title) => {
                try {
                    const response = await createProject(title);
                    const project = response;
                    if (project) {
                        set({ project });
                    }
                } catch (error) {
                    console.error(error);
                }
                set({ isLoaded: true });
            },

            setState: (state) => set({ state }),
            setDrawState: (state) => set({ drawState: state }),

            setStage: (stage) => set({ stage }),
            setSelectedLayer: (layer) => {
                setOffDragable();
                setOnDraggableLayer(layer);

                set((state) => {
                    return {
                        selectedLayer: layer,
                        changedLayersSwitch: !state.changedLayersSwitch,
                    };
                });
            },
            toggleLayersSwitch: () =>
                set((state) => ({
                    changedLayersSwitch: !state.changedLayersSwitch,
                })),

            setSelectredShape: (shape) => set({ selectedShape: shape }),
            setSelectredImage: (image) => set({ selectedImage: image }),
            setSelectedBackgroundImage: (image) =>
                set({ selectedBackgroundImage: image }),
            setUpdatePreview: () => {
                set((state) => ({
                    updatePreview: !state.updatePreview,
                }));
                const isLogin = useUserStore.getState().isLogin;
                if (!isLogin) return;

                const stage = useProjectStore.getState().stage;
                const sendData = () => {
                    if (stage) {
                        saveProject(stage);
                    }
                };

                const isCooldown = useProjectStore.getState().coolDown;
                const setCoolDown = useProjectStore.getState().setCoolDown;
                if (!isCooldown) {
                    sendData();
                    setCoolDown(true);

                    setTimeout(() => {
                        setCoolDown(false);
                    }, 15000);
                }
            },

            setBrushSettings: (settings) =>
                set((state) => ({
                    brushSettings: { ...state.brushSettings, ...settings },
                })),
            setShapeSettings: (settings) =>
                set((state) => ({
                    shapeSettings: { ...state.shapeSettings, ...settings },
                })),
            setTextSettings: (settings) =>
                set((state) => ({
                    textSettings: { ...state.textSettings, ...settings },
                })),
            setShowBackgroundColorFill: (value) =>
                set({ showBackgroundColorFill: value }),
            saveProject: () => {
                const stage = getState().stage;
                if (!stage) return;
                const isLogin = useUserStore.getState().isLogin;
                if (!isLogin) return;
                saveProject(stage);
            },

            addStageToHistory: (stageJSON) => {
                if (!stageJSON) {
                    const stage = getState().stage;
                    if (!stage) return;
                    stageJSON = stage.toJSON();
                }
                const stack = getState().historyStageStack;
                let index = getState().currentHistoryStackIndex;

                let pastStack = stack.slice(0, index + 1);
                if (stack.length - 1 > index) index = stack.length - 1;
                pastStack.push(stageJSON);
                if (pastStack.length > 20) {
                    pastStack = pastStack.slice(
                        pastStack.length - 20,
                        pastStack.length,
                    );
                }
                set({
                    historyStageStack: pastStack,
                    currentHistoryStackIndex: pastStack.length - 1,
                });
            },

            backHistory: () => {
                const stack = getState().historyStageStack;
                const index = getState().currentHistoryStackIndex - 1;
                if (
                    !stack ||
                    stack.length === 0 ||
                    stack.length === 1 ||
                    index < 0
                )
                    return;
                const newStageJSON = stack[index];
                if (!newStageJSON) return;
                restoreStageFromJSON(newStageJSON);

                set({ currentHistoryStackIndex: index });
            },
            forwardHistory: () => {
                const stack = getState().historyStageStack;
                const index = getState().currentHistoryStackIndex + 1;
                if (
                    !stack ||
                    stack.length === 0 ||
                    stack.length === 1 ||
                    index < 0
                )
                    return;
                const newStageJSON = stack[index];
                if (!newStageJSON) return;
                restoreStageFromJSON(newStageJSON);

                set({ currentHistoryStackIndex: index });
            },
        })),
    ),
);
