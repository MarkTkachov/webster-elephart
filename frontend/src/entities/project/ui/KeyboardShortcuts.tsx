import { FC, useEffect } from 'react';
import { useProjectStore } from '../model/projectStore';
import { saveProject } from '../api/saveProject';
import { isUniversalCtrlPressed } from '@/shared/lib/utils';

export const KeyboardShortcuts: FC = () => {
    const [stage, backHistory, forwardHistory] = useProjectStore((state) => [
        state.stage,
        state.backHistory,
        state.forwardHistory,
    ]);

    useEffect(() => {
        if (!stage) return;

        const handleKeyDown = (ev: KeyboardEvent) => {
            // Ctrl Shift Z and Ctrl Y
            if (
                (ev.key == 'z' && isUniversalCtrlPressed(ev) && ev.shiftKey) ||
                (ev.key == 'y' && isUniversalCtrlPressed(ev))
            ) {
                return forwardHistory();
            }
            //Ctrl Z
            if (ev.key == 'z' && isUniversalCtrlPressed(ev)) {
                return backHistory();
            }
            // Ctrl S
            if (ev.key == 's' && isUniversalCtrlPressed(ev)) {
                ev.preventDefault();
                return saveProject(stage);
            }
        };
        addEventListener('keydown', handleKeyDown);
        return () => {
            removeEventListener('keydown', handleKeyDown);
        };
    }, [backHistory, forwardHistory, stage]);

    return null;
};
