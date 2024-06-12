import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/user';
import { RestorePasswordEmailModal } from './RestorePasswordEmailModal';

export const LoginUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const loginUser = useUserStore((state) => state.loginUser);
    const navigate = useNavigate();
    const handleLogin = async () => {
        await loginUser(email, password);
        return navigate('/home');
    };

    return (
        <>
            <div className="w-1/2">
                <Label className="font-bold">email *</Label>
                <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="w-1/2">
                <Label className="font-bold">password *</Label>
                <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <RestorePasswordEmailModal />
            <button
                className=" mt-4 w-1/2 rounded-lg bg-green-600 p-[12px] text-sm text-background text-white"
                onClick={handleLogin}
            >
                Login
            </button>
        </>
    );
};
