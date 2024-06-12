import { useUserStore } from '@/entities/user';
import { SavedProjectTile } from './SavedProjectTile';
import { useState } from 'react';
const Gallery = () => {
    const projects = useUserStore((state) => state.projects);
    const updateProject = useUserStore((state) => state.updateProject);

    const [visibleMenu, setVisibleMenu] = useState<string | null>(null);
    const handleMenuToggle = (id: string) => {
        setVisibleMenu((prev) => (prev === id ? null : id));
    };

    const handleTitleUpdate = async (id: string, newTitle: string) => {
        // Handle title update logic here, for example, update the project title in your state or send an API request
        updateProject(newTitle, id);
    };

    return (
        <div className="m-4 flex flex-wrap gap-4">
            {projects
                ?.toSorted((a, b) => {
                    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
                })
                .map((pr) => (
                    <SavedProjectTile
                        key={pr._id}
                        project={pr}
                        isMenuVisible={visibleMenu === pr._id}
                        onMenuToggle={() => handleMenuToggle(pr._id)}
                        onTitleUpdate={handleTitleUpdate}
                    />
                ))}
            {(!projects || projects.length === 0) && <>You have no projects</>}
        </div>
    );
};

export default Gallery;
