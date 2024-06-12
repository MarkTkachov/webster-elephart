import { useEffect } from 'react';
import { useUserStore } from '@/entities/user';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const logoutUser = useUserStore((state) => state.logoutUser);
    const navigate = useNavigate();
    useEffect(() => {
        const performLogout = async () => {
            logoutUser();
            return navigate('/home');
        };

        performLogout();
    });

    return <div>Logging out...</div>;
};

export default Logout;
