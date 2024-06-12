import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface IInitProjectStoreState {
    width: number;
    height: number;
    serializedJSON: string | null;
    startingImage: string | null;
    startingBackgroundImage: string | null;
}

interface IInitProjectActions {
    resetStore: VoidFunction;
    setWidth: (w: number) => void;
    setHeight: (h: number) => void;
    setSerializedJSON: (json: string | null) => void;
    setStartingImage: (image: string | null) => void;
    setStartingBackgroundImage: (image: string | null) => void;
}

const initState = {
    width: 600,
    height: 800,
    serializedJSON: null,
    startingImage: null,
    startingBackgroundImage: null,
};

export const useInitProjectStore = create<
    IInitProjectStoreState & IInitProjectActions
>()(
    devtools(
        immer((set, get) => ({
            ...initState,
            resetStore: () => {
                set({ ...initState });
            },
            setHeight(h) {
                set({ height: h });
            },
            setWidth(w) {
                set({ width: w });
            },
            setSerializedJSON: (json) => {
                set({ serializedJSON: json });
            },
            setStartingImage: (image) => {
                set({ startingImage: image });
            },
            setStartingBackgroundImage: (image) => {
                set({ startingBackgroundImage: image });
            },
        })),
    ),
);
