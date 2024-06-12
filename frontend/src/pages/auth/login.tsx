import { LoginUser } from '@/entities/user';
import SignUpGoogle from '@/entities/user/ui/SignUpGoogle';

import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="relative grid min-h-screen  grid-cols-5">
            {/* Псевдоэлемент для фонового изображения */}
            <div
                className="absolute inset-0 col-span-5 scale-x-[-1] transform bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('../src/public/bg-2.jpg')`,
                }}
            ></div>

            <div className="col-span-3"></div>
            <div className="z-10 col-span-2 m-2 rounded-lg border bg-background shadow-lg">
                <div className="flex h-full w-full flex-col items-center justify-center text-2xl">
                    <p className="w-1/2 text-center font-bold">Welcome back!</p>
                    <LoginUser />

                    <div className="mt-4 flex w-1/2 items-center text-sm">
                        <hr className="flex-grow border-t border-gray-300" />
                        <span className="mx-2 text-xs text-muted-foreground">
                            Or, Login with
                        </span>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    <SignUpGoogle />
                    <span className="mt-4 w-1/2 text-center text-xs text-foreground">
                        Don't have an account?{' '}
                        <span className="cursor-pointer text-green-600 underline">
                            <Link to="/auth/registration">Sign up</Link>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
