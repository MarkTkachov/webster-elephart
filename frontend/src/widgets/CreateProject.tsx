import {
    createProject,
    updatePicture,
    useProjectStore,
} from '@/entities/project';
import { useInitProjectStore } from '@/entities/project/model/initProjectStore';
import { useUserStore } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { PlusCircleIcon } from 'lucide-react';
import { ChangeEvent, FC, ReactNode, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProjectModal: FC<{ className?: string; children?: ReactNode }> = ({
    className,
    children,
}) => {
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const backgroundImageInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const setProjects = useUserStore((state) => state.setProjects);
    const setProject = useProjectStore((state) => state.setProject);
    const projects = useUserStore((state) => state.projects);
    const isLogin = useUserStore((state) => state.isLogin);

    const [
        setStartImage,
        setStartBackgroundImage,
        setStartJSON,
        setWidth,
        setHeight,
        resetStore,
    ] = useInitProjectStore((state) => [
        state.setStartingImage,
        state.setStartingBackgroundImage,
        state.setSerializedJSON,
        state.setWidth,
        state.setHeight,
        state.resetStore,
    ]);

    const [initWidth, initHeight] = useInitProjectStore((state) => [
        state.width,
        state.height,
    ]);

    const [title, setTitle] = useState('');

    const handleSelectImageForProject = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (!title || title.trim().length == 0) return;
            let projData = null;
            if (isLogin) projData = await createProject(title);
            // console.log(projData);

            let data: any = null;
            if (isLogin) {
                data = (await updatePicture(file, projData._id)).image;
            } else {
                data = e.target?.result;
                if (typeof data !== 'string') return;
            }
            // console.log(data);

            const img = new window.Image();
            img.src = data;
            img.onload = async () => {
                resetStore();
                setHeight(img.height);
                setWidth(img.width);
                setStartImage(data);
                setStartBackgroundImage(null);
                setStartJSON(null);
                img.remove();
                if (!isLogin) {
                    navigate('/projects/tmp');
                    return;
                }
                if (projData) {
                    const formatedProjects = projects
                        ? [...projects, projData]
                        : [projData];
                    setProjects(formatedProjects as []);
                    setProject(projData);
                    navigate(`/projects/${projData._id}`);
                }
            };
        };
        reader.readAsDataURL(file);
    };

    const handleSelectbackgroundImageForProject = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (!title || title.trim().length == 0) return;
            let projData = null;
            if (isLogin) projData = await createProject(title);
            let data: any = null;
            if (isLogin) {
                data = (await updatePicture(file, projData._id)).image;
            } else {
                data = e.target?.result;
                if (typeof data !== 'string') return;
            }
            const img = new window.Image();
            img.src = data;
            img.onload = async () => {
                resetStore();
                setHeight(img.height);
                setWidth(img.width);
                setStartImage(null);
                setStartBackgroundImage(data);
                setStartJSON(null);
                img.remove();
                if (!isLogin) {
                    navigate('/projects/tmp');
                    return;
                }
                if (projData) {
                    const formatedProjects = projects
                        ? [...projects, projData]
                        : [projData];
                    setProjects(formatedProjects as []);
                    setProject(projData);
                    navigate(`/projects/${projData._id}`);
                }
            };
        };
        reader.readAsDataURL(file);
    };

    const handleCreate = async () => {
        // resetStore();
        setStartImage(null);
        setStartBackgroundImage(null);
        setStartJSON(null);
        if (!isLogin) {
            navigate('/projects/tmp');
            return;
        }
        if (!title || title.trim().length == 0) return;
        const data = await createProject(title);
        if (data) {
            const formatedProjects = projects ? [...projects, data] : [data];
            setProjects(formatedProjects as []);
            setProject(data);
        }

        navigate(`/projects/${data._id}`);
    };

    return (
        <Dialog>
            <DialogTrigger className={className}>{children}</DialogTrigger>
            <DialogContent className="w-1/3">
                <DialogTitle>Create Project</DialogTitle>
                <div className="grid grid-cols-2">
                    <div className="col-span-1 flex flex-col gap-4">
                        <Input
                            value={title}
                            required
                            type="text"
                            placeholder="Project Title"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Label className="col-span-1 text-center text-lg font-bold">
                                Width
                            </Label>
                            <div className="col-span-4">
                                <Input
                                    value={initWidth}
                                    required
                                    placeholder="Project Width"
                                    onChange={(e) =>
                                        setWidth(Number(e.target.value))
                                    }
                                />
                            </div>

                            <Label className="col-span-1 text-center text-lg font-bold">
                                Height
                            </Label>
                            <div className="col-span-4">
                                <Input
                                    value={initHeight}
                                    required
                                    placeholder="Project Height"
                                    onChange={(e) =>
                                        setHeight(Number(e.target.value))
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col">
                        <p className="p-2 text-center text-xs font-bold text-muted-foreground">
                            write a title for your project and select an image
                        </p>

                        <button
                            className="rounded-lg px-4 py-2 text-center hover:bg-secondary disabled:text-gray-500"
                            onClick={() => imageInputRef.current?.click()}
                            disabled={!title || title.trim().length == 0}
                        >
                            Create Project with image
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleSelectImageForProject}
                            className="hidden"
                            ref={imageInputRef}
                        />
                        <button
                            className="rounded-lg px-4 py-2 text-center hover:bg-secondary disabled:text-gray-500"
                            onClick={() =>
                                backgroundImageInputRef.current?.click()
                            }
                            disabled={!title || title.trim().length == 0}
                        >
                            Create Project with background image
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleSelectbackgroundImageForProject}
                            className="hidden"
                            ref={backgroundImageInputRef}
                        />
                    </div>
                </div>
                <DialogClose className="flex items-end justify-end gap-4">
                    <Button variant="ghost">Close</Button>
                    <Button onClick={handleCreate} className="w-[150px]">
                        Create
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectModal;
