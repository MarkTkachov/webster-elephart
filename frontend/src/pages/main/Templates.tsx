import Carousel from '@/widgets/Carousel';
import MainLayout from '../MainLayout';
import HomeLayout from './HomeLayout';

const Templates = () => {
    return (
        <MainLayout>
            <HomeLayout>
                <div className="flex h-full w-full pl-4 pr-2 pt-4">
                    <div className="h-full w-full rounded-t-lg bg-background p-4">
                        <h2 className='underline decoration-green-600 decoration-2 underline-offset-4 text-xl font-bold mb-1'>Recomended</h2>
                        <Carousel />
                    </div>
                </div>
            </HomeLayout>
        </MainLayout>
    );
};

export default Templates;
