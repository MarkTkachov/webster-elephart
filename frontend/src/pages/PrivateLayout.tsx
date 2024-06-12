import { useUserStore } from '@/entities/user';
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PrivateLayout = ({ children }: { children: ReactNode }) => {
    const isLogin = useUserStore((state) => state.isLogin);
    const checked = useUserStore((state) => state.checked);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin && checked) {
            navigate('/');
        }
    }, [isLogin, checked]);

    return <div className='w-full h-full'>{children}</div>;
};
