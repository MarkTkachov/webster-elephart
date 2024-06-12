import $api from '@/app/http/axios';
import { passwordRegex } from '@/shared/lib/passwordRegex';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const RestorePasswordPage: FC = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const passwordsMatch = newPassword.trim() == confirmPassword.trim();

    const handleClick = async () => {
        if (!passwordsMatch || !newPassword.match(passwordRegex)) return;
        setLoading(true);
        try {
            await $api.post(`/auth/password-reset/${token}`, {
                password: newPassword,
            });
            navigate('/auth/login');
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

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
                    <p className="w-1/2 text-center font-bold">
                        Reset Password
                    </p>
                    <Input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                        placeholder="New password"
                        autoComplete="new-password"
                        className="m-2 w-96"
                    />
                    <Input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        placeholder="Confirm Password"
                        autoComplete="confirm-password"
                        className="m-2 w-96"
                    />
                    <p
                        hidden={!!newPassword.match(passwordRegex)}
                        className="text-sm"
                    >
                        Password must be at least 8 characters long, contain at
                        least one letter, one number, and one special character.
                    </p>
                    <Button
                        disabled={
                            !passwordsMatch ||
                            newPassword.trim().length === 0 ||
                            confirmPassword.trim().length === 0 ||
                            loading
                        }
                        className="m-2"
                        onClick={handleClick}
                        type="submit"
                    >
                        Reset Password
                    </Button>
                </div>
            </div>
        </div>
    );
};
