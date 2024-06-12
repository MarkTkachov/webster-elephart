import { LayersStack } from './LayersStack';
import Preview from './Preview';

const ProjectRightSidebar = () => {
    return (
        <div className="fixed right-0 z-10 h-full w-[300px] bg-background shadow-md border">
            <div className="flex h-full flex-col border-t-4 border-dashed">
                <div className=''>
                    <Preview />
                </div>
                <LayersStack />
            </div>
        </div>
    );
};

export default ProjectRightSidebar;
