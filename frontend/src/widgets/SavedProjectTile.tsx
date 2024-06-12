import { API_URL } from '@/app/http/axios';
import { IProject, useUserStore } from '@/entities/user/model/userStore';
import { CheckIcon, Cross1Icon } from '@radix-ui/react-icons';
import { PenIcon } from 'lucide-react';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SavedProjectTileProps {
    project: IProject;
    isMenuVisible: boolean;
    onMenuToggle: () => void;
    onTitleUpdate: (id: string, title: string) => void;
}

export const SavedProjectTile: FC<SavedProjectTileProps> = ({
    project,
    isMenuVisible,
    onMenuToggle,
    onTitleUpdate,
}) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(project.title);
    const deleteProject = useUserStore((state) => state.deleteProject);

    const handleEdit = () => {
        setIsEditing(true);
        onMenuToggle(); // Hide menu after action
    };

    const handleDelete = () => {
        // Handle delete logic here
        deleteProject(project._id);
        onMenuToggle(); // Hide menu after action
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(event.target.value);
    };

    const handleTitleSave = () => {
        onTitleUpdate(project._id, newTitle);
        setIsEditing(false);
    };

    const handleTitleBlur = () => {
        setIsEditing(false);
        setNewTitle(project.title);
    };

    return (
            <div className="flex max-h-[300px] flex-col items-center justify-between rounded p-2">
            <div className="relative rounded-lg border-2 border-background transition-all duration-300 ease-in-out hover:border-primary">
                <div
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="relative rounded-lg"
                >
                    <img
                        className="rounded-lg transition-all duration-300 ease-in-out hover:blur-sm"
                        src={`${API_URL}/project/${project._id}/thumbnail`}
                        alt={`Preview ${project.title}`}
                    />
                    <div className="absolute inset-0 flex items-end rounded-lg bg-gradient-to-t from-neutral-900 to-transparent opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
                        <div className="relative w-full p-2 text-center">
                            <div className="group relative flex items-center justify-center">
                                {isEditing ? (
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            value={newTitle}
                                            onChange={handleTitleChange}
                                            onClick={(e) => e.stopPropagation()}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleTitleSave();
                                                } else if (e.key === 'Escape') {
                                                    handleTitleBlur();
                                                }
                                            }}
                                            className="w-[100px] text-center"
                                            autoFocus
                                        />
                                        <CheckIcon
                                            className="absolute right-4 h-5 w-5 text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTitleSave();
                                            }}
                                        />
                                        <Cross1Icon
                                            className="absolute right-0 h-4 w-4 text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTitleBlur();
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <span className="text-white">
                                        {project.title}
                                    </span>
                                )}
                                <div className="absolute right-0 ml-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <div
                                        className="z-20 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Добавьте этот вызов, чтобы предотвратить всплывание события
                                            onMenuToggle();
                                        }}
                                    >
                                        {isEditing ? null : (
                                            <PenIcon className="h-3 w-3 text-white" />
                                        )}
                                    </div>
                                    {isMenuVisible && (
                                        <div
                                            className="w-21 absolute right-0 top-full z-30 rounded-lg border bg-background text-sm text-foreground shadow-md"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                className="block w-full p-2 text-left hover:bg-secondary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit();
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="block w-full p-2 py-2 text-left hover:bg-secondary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete();
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
