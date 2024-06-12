import { useEffect, useState } from 'react';
import { signUpGoogleCallback } from '@/entities/user/api/signUpGoogle';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/user';

const Callback = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        (async () => {
            const queryParams =
                typeof window !== 'undefined'
                    ? new URLSearchParams(window.location.search)
                    : null;
            const code = queryParams ? queryParams.get('code') : null;
            if (code && !isProcessing) {
                setIsProcessing(true);
                try {
                    const response = await signUpGoogleCallback(code);
                    if (response?.status === 200) {
                        setUser(response.data);
                        navigate('/home', { replace: true });
                        window.location.reload();
                    }
                } catch (error) {
                    console.error(error);
                    navigate('/auth/login', { replace: true });
                    window.location.reload();
                }
            }
        })();
    }, []);

    return <div>Loading...</div>;
};

export default Callback;
