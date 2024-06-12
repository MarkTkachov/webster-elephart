import React, { useCallback, useEffect, useState } from 'react';
import { MinusIcon, PlusIcon, SymbolIcon } from '@radix-ui/react-icons';

import Konva from 'konva';
import { useProjectStore } from '@/entities/project';
import { isUniversalCtrlPressed } from '@/shared/lib/utils';

export const ScaleBar: React.FC = () => {
    const [zoomPercentage, setZoomPercentage] = useState(100);
    const stage = useProjectStore((state) => state.stage);
    const handleZoom = useCallback(
        (direction: 'in' | 'out') => {
            if (!stage) return;

            const scaleBy = 1.5;
            const oldScale = stage.scaleX();
            const newScale =
                direction === 'in' ? oldScale * scaleBy : oldScale / scaleBy;

            stage.scale({ x: newScale, y: newScale });
            if (direction === 'in') {
                stage.width(stage.width() * scaleBy);
                stage.height(stage.height() * scaleBy);
            } else {
                stage.width(stage.width() / scaleBy);
                stage.height(stage.height() / scaleBy);
            }
            stage.batchDraw();

            const percentage = Math.round(newScale * 100);
            setZoomPercentage(percentage);
        },
        [stage],
    );

    const handleResetZoom = useCallback(() => {
        if (!stage) return;
        stage?.width(stage?.width() / stage?.scaleX());
        stage?.height(stage?.height() / stage?.scaleY());
        stage?.scale({ x: 1, y: 1 });
        setZoomPercentage(100);
    }, [stage]);

    //Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (ev: KeyboardEvent) => {
            //Ctrl +, on laptop w/out numpad it is Ctrl =
            if (
                (ev.key == '+' || ev.key == '=') &&
                isUniversalCtrlPressed(ev)
            ) {
                ev.preventDefault();
                return handleZoom('in');
            }
            //Ctrl -
            if (ev.key == '-' && isUniversalCtrlPressed(ev)) {
                ev.preventDefault();
                return handleZoom('out');
            }
            // Ctrl 0
            if (ev.key == '0' && isUniversalCtrlPressed(ev)) {
                ev.preventDefault();
                return handleResetZoom();
            }
        };
        addEventListener('keydown', handleKeyDown);
        return () => {
            removeEventListener('keydown', handleKeyDown);
        };
    }, [handleResetZoom, handleZoom]);

    useEffect(() => {
        if (!stage) return;
        setZoomPercentage(stage.scaleX() * 100);
    }, [stage]);

    return (
        <div className="fixed bottom-5 w-full select-none pr-[300px]">
            <div className="flex w-full justify-center">
                <div className="flex items-center gap-8 rounded-lg border bg-background px-8 py-2 shadow-md">
                    <PlusIcon
                        onClick={() => handleZoom('in')}
                        className=" cursor-pointer"
                    />
                    <MinusIcon
                        onClick={() => handleZoom('out')}
                        className=" cursor-pointer"
                    />
                    <span className="w-[100px] text-center text-lg">
                        {zoomPercentage}%
                    </span>
                    <SymbolIcon
                        onClick={handleResetZoom}
                        className=" cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};
