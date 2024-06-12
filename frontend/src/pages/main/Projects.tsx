import MainLayout from '../MainLayout';
import HomeLayout from './HomeLayout';
import Gallery from '@/widgets/Gallery';

const Projects = () => {
    
    return (
        <MainLayout>
            <HomeLayout>
                <div className="flex w-full pl-4 pr-2 pt-4">
                    <Gallery />
                </div>
            </HomeLayout>
        </MainLayout>
    );
};

export default Projects;
