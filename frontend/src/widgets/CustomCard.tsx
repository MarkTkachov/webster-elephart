import React, { ChangeEvent, useRef, useState } from 'react';
import {
    Card as ShadCard,
    CardContent as ShadCardContent,
} from '@/shared/ui/card';
import './CustomCard.css';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/user';
import {
    createProject,
    updatePicture,
    useProjectStore,
} from '@/entities/project';
import { useInitProjectStore } from '@/entities/project/model/initProjectStore';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import CreateProjectModal from './CreateProject';

const CustomCard = ({
    imageSrc,
    caption,
    dimensions,
    height,
    width,
}: {
    imageSrc: string;
    caption: string;
    dimensions: string;
    height: number;
    width: number;
}) => {
    const [setWidth, setHeight] = useInitProjectStore((state) => [
        state.setWidth,
        state.setHeight,
    ]);
    return (
        <CreateProjectModal>
            <div
                className="custom-card p-1"
                onClick={() => {
                    setHeight(height);
                    setWidth(width);
                }}
            >
                <ShadCard className="relative h-full w-full overflow-hidden">
                    <ShadCardContent className="gradient-background relative flex h-full w-full items-center justify-center p-6">
                        <div className="w-full text-center">
                            <div className="image-container">
                                <img
                                    src={imageSrc}
                                    alt={caption}
                                    className="image"
                                />
                            </div>
                            <div className="mt-2 text-sm">{caption}</div>
                            <div className="text-xs text-gray-500">
                                {dimensions}
                            </div>
                        </div>
                        <div className="overlay absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-60 opacity-0 transition-opacity duration-300">
                            <span className="text-white">Create blank</span>
                            <span className="mt-1 text-sm text-white">
                                {dimensions}
                            </span>
                        </div>
                    </ShadCardContent>
                </ShadCard>
            </div>
        </CreateProjectModal>
    );
};

export default CustomCard;
