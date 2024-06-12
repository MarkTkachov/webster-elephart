import { Card, CardContent } from '@/shared/ui/card';
import Carousel from '@/widgets/Carousel';
import MainLayout from '../MainLayout';
import { PrivateLayout } from '../PrivateLayout';
import HomeLayout from './HomeLayout';
import Gallery from '@/widgets/Gallery';

const Home = () => {

    return (
        <MainLayout>
            <HomeLayout>
                <PrivateLayout>
                    <div className="flex h-full w-full flex-col gap-4 px-4 pt-4">
                        <div className="phone:h-[250px] lg:h-[250px] xl:h-[350px]">
                            <Card className="phone:h-[250px] lg:h-[250px] xl:h-[350px]">
                                <CardContent
                                    className="flex h-full select-none items-center rounded-md bg-cover bg-center p-6"
                                    style={{
                                        backgroundImage: `url('../src/public/background.png')`,
                                    }}
                                >
                                    <p className="ipad:text-4xl phone:text-xl font-bold text-white lg:text-5xl xl:text-6xl">
                                        Welcome to ElephArt <br /> create your
                                        masterpieces with us!
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="h-full w-full rounded-lg bg-background">
                            {/* <button onClick={handleCreate}>new</button> */}
                            <h2 className="mx-4 my-4 text-left text-xl font-bold">
                                You might want to try...
                            </h2>
                            <Carousel />
                            <h2 className="mx-4 my-4 text-left text-xl font-bold">
                                Your gallery
                            </h2>
                            <Gallery />
                        </div>
                    </div>
                </PrivateLayout>
            </HomeLayout>
        </MainLayout>
    );
};

export default Home;
