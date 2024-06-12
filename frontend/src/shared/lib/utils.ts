import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const isUniversalCtrlPressed = (ev: KeyboardEvent) => {
    if ('platform' in window.navigator) {
        //macos has Option key as default instead of Ctrl for many stuff
        return (
            (window.navigator.platform.match('Mac') && ev.metaKey) ||
            (!window.navigator.platform.match('Mac') && ev.ctrlKey)
        );
    } else return ev.ctrlKey;
};
