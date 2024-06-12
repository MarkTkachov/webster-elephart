import HomeSideBar from '@/widgets/HomeSideBar';
import { ReactNode } from 'react';

const HomeLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="pt-[50px] h-full">
            <HomeSideBar />
            <main className="h-full pl-[250px] flex">{children}</main>
        </div>
    );
};

export default HomeLayout;
