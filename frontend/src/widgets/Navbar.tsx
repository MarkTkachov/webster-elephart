import { Img } from 'react-image';
import { Skeleton } from '../shared/ui/skeleton';
import { useUserStore } from '@/entities/user/model/userStore';
import { Link, useNavigate } from 'react-router-dom';
import { UserCard } from '@/entities/user';

const Navbar = () => {
    const isLogin = useUserStore((state) => state.isLogin);
    const isLoaded = useUserStore((state) => state.isLoaded);
    const navigate = useNavigate();
    return (
        <header className="fixed top-0 z-50 w-full bg-background">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="flex">
                    <div
                        className="flex cursor-pointer items-center gap-2 text-xl text-foreground"
                        onClick={() => {
                            navigate('/home');
                        }}
                    >
                        <Img
                            src="../src/public/logo.svg"
                            alt="My Image"
                            loader={<div>Loading...</div>}
                            unloader={<div>Failed to load image.</div>}
                            className="h-12 text-foreground"
                        />
                        <Img
                            src="../src/public/logo-name.svg"
                            alt="My Image"
                            loader={<div>Loading...</div>}
                            unloader={<div>Failed to load image.</div>}
                            className="h-16 pt-1"
                        />
                    </div>
                </div>
                {!isLoaded ? (
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <Skeleton className="h-4 w-[250px]" />
                    </div>
                ) : isLogin ? (
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <UserCard />
                    </div>
                ) : (
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <button className=" rounded-3xl border-2 border-foreground px-6 py-3 text-xs font-bold">
                            <Link to="/auth/login">Login</Link>
                        </button>
                        <button className=" rounded-3xl bg-foreground px-6 py-3 text-xs font-bold text-background">
                            <Link to="/auth/registration">Sign up</Link>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
