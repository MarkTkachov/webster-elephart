import $api from '@/app/http/axios';
import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { FC, useState } from 'react';

export const RestorePasswordEmailModal: FC = () => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleClick = () => {
        const sendData = async () => {
            if (!email || email.trim().length === 0) return;
            await $api.post('/auth/password-reset/send-email', {
                email: email.trim(),
            });
            setIsSent(true);
        };
        sendData();
    };

    return (
        <Dialog>
            <DialogTrigger>
                <span className="mt-4 w-1/2 cursor-pointer text-center text-xs text-foreground text-green-600 underline">
                    Forgot your password?
                </span>
            </DialogTrigger>
            <DialogContent className="max-w-[600px]">
                <DialogTitle>Enter Your Email</DialogTitle>
                <div className="m-4 flex flex-row">
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        autoComplete="email"
                        placeholder="Account Email"
                    />
                    <Button className="mx-2" onClick={handleClick}>
                        Send
                    </Button>
                </div>
                {isSent && (
                    <div className="m-auto text-center">
                        Email was sent to your address
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
