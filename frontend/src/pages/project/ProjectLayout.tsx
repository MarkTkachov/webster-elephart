import ProjectLeftSidebar from '@/widgets/ProjectLeftSidebar';
import { ProjectNavbar } from '@/widgets/ProjectNavbar';
import ProjectRightSidebar from '@/widgets/ProjectRightSidebar';
import { ScaleBar } from '@/widgets/project/scaleBar';
import { ReactNode } from 'react';

const ProjectLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="h-full w-full pt-[50px] pr-[300px]">
            <ProjectNavbar />
            <ProjectLeftSidebar />
            <ProjectRightSidebar />
            <div className="flex h-full w-full items-center pt-[100px] pb-[100px]">
                {children}
            </div>
            <ScaleBar />
        </div>
    );
};

export default ProjectLayout;
