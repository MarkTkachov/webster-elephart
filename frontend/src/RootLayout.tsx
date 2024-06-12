import { useUserStore } from '@/entities/user';
import { ReactNode, useEffect } from 'react';

const RootLayout = ({ children }: { children: ReactNode }) => {
    const checkAuth = useUserStore((state) => state.checkAuth);
    const checked = useUserStore((state) => state.checked);
    useEffect(() => {
        const handleCheckAuth = async () => {
            if (checked) return;
            try {
                await checkAuth();
            } catch (error) {
                console.error('Error checking authentication:', error);
                // Handle error if needed
            }
        };

        handleCheckAuth();
    }, [checked]);
    return (
        <div className="h-screen">
            {checked ? (
                <main className="h-full">{children}</main>
            ) : (
                <div className="flex h-full items-center justify-center">
                    <p className="text-lg text-foreground">
                        Checking authentication...
                    </p>
                </div>
            )}
        </div>
    );
};

export default RootLayout;
