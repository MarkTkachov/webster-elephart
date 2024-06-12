import Navbar from '@/widgets/Navbar';
import { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="h-full">
            <Navbar />
            <main className="h-full">{children}</main>
        </div>
    );
};

export default MainLayout;
