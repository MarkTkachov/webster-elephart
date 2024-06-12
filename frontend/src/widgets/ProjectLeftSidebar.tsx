import { updatePicture, useProjectStore } from '@/entities/project';
import { setOnDragable } from '@/entities/project/lib/setDragable';
import { useUserStore } from '@/entities/user';
import TooltipIcon from '@/shared/ui/tooltip';
import {
    BoxIcon,
    CursorArrowIcon,
    EraserIcon,
    GroupIcon,
    ImageIcon,
    Pencil1Icon,
    TextIcon,
} from '@radix-ui/react-icons';
import { ArrowBigLeft, ArrowBigRight, PaintBucketIcon } from 'lucide-react';

import { useRef } from 'react';

const ProjectLeftSidebar = () => {
    const setState = useProjectStore((state) => state.setState);
    const setImage = useProjectStore((state) => state.setSelectredImage);
    const isLogin = useUserStore((state) => state.isLogin);
    const [backHistory, forwardHistory] = useProjectStore((state) => [
        state.backHistory,
        state.forwardHistory,
    ]);

    const inputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            if (isLogin) {
                const src = await updatePicture(file);
                setImage(src);
            } else {
                const data = ev.target?.result;
                if (typeof data !== 'string') return;
                setImage(data);
            }
            setState('SelectImage');
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed left-5 z-10 h-full">
            <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="flex w-full flex-col rounded-lg border bg-background shadow-md">
                    <div className="flex h-10 w-full items-center justify-center p-1">
                        <TooltipIcon
                            icon={CursorArrowIcon}
                            tooltipText={{
                                title: 'Drag mode',
                                description:
                                    'Move and resize objects on the canvas.',
                                shortcut: 'Drag to move, dblclick to resize',
                            }}
                            imgSrc="../src/public/tooltip-drag.jpg"
                            onClick={() => {
                                setState('Drag');
                                setOnDragable();
                            }}
                        />
                    </div>
                    <div className="flex h-10 w-full items-center justify-center">
                        <TooltipIcon
                            icon={GroupIcon}
                            tooltipText={{
                                title: 'Selection mode',
                                description:
                                    'Select an area to move or resize it.',
                                shortcut:
                                    'LCM to start and RCM to end selection, drag to move',
                            }}
                            imgSrc="../src/public/tooltip-select.jpg"
                            onClick={() => setState('SelectionArea')}
                        />
                    </div>
                    <div className="flex h-10 w-full items-center justify-center">
                        <TooltipIcon
                            icon={BoxIcon}
                            tooltipText={{
                                title: 'Create figure',
                                description: 'Draw some shapes on the canvas.',
                                shortcut: 'LCM to start and end drawing',
                            }}
                            imgSrc="../src/public/tooltip-shapes.jpg"
                            onClick={() => setState('CreateFigure')}
                        />
                    </div>
                    <div className="flex h-10 w-full items-center justify-center">
                        <TooltipIcon
                            icon={Pencil1Icon}
                            tooltipText={{
                                title: 'Drawing mode',
                                description: 'Draw on the canvas.',
                                shortcut: 'LCM to start and end drawing',
                            }}
                            imgSrc="../src/public/tooltip-draw.jpg"
                            onClick={() => setState('Drawing')}
                        />
                    </div>
                    <div className="flex h-10 w-full items-center justify-center">
                        <TooltipIcon
                            icon={EraserIcon}
                            tooltipText={{
                                title: 'Erasing mode',
                                description: 'Erase objects on the canvas.',
                                shortcut: 'LCM to start and end erasing',
                            }}
                            imgSrc="../src/public/tooltip-eraser.jpg"
                            onClick={() => setState('Erasing')}
                        />
                    </div>
                    <div className="flex h-10 w-full items-center justify-center">
                        <TooltipIcon
                            icon={ImageIcon}
                            tooltipText={{
                                title: 'Image mode',
                                description: 'Add an image to the canvas.',
                                shortcut: '',
                            }}
                            imgSrc="../src/public/tooltip-image.webp"
                            onClick={handleClick}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            ref={inputRef}
                        />
                    </div>
                    <div className="flex h-10 w-full items-center justify-center">
                        <TooltipIcon
                            icon={TextIcon}
                            tooltipText={{
                                title: 'Text mode',
                                description: 'Add text to the canvas.',
                                shortcut: 'LCM to add text',
                            }}
                            imgSrc="../src/public/tooltip-text.jpg"
                            onClick={() => setState('Text')}
                        />
                    </div>
                    <div className="flex h-10 w-full items-center justify-center">
                        <TooltipIcon
                            icon={PaintBucketIcon}
                            tooltipText={{
                                title: 'Fill mode',
                                description:
                                    'Fill background with color or image.',
                                shortcut: 'choose color or image in navbar',
                            }}
                            imgSrc="../src/public/fill.jpg"
                            onClick={() => setState('SelectBackground')}
                        />
                    </div>
                    <div className="flex h-10 w-full items-center justify-center">
                        <TooltipIcon
                            icon={ArrowBigLeft}
                            tooltipText={{
                                title: 'Undo Action',
                                description: 'Undo Your Latest Action',
                                shortcut: 'Ctrl Z',
                            }}
                            imgSrc="../src/public/fill.jpg"
                            onClick={() => backHistory()}
                        />
                    </div>
                    <div className="flex h-10 w-full items-center justify-center">
                        <TooltipIcon
                            icon={ArrowBigRight}
                            tooltipText={{
                                title: 'Redo Action',
                                description: 'Redo the undone action',
                                shortcut: 'Ctrl Shift Z or Ctrl Y',
                            }}
                            imgSrc="../src/public/fill.jpg"
                            onClick={() => forwardHistory()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectLeftSidebar;
