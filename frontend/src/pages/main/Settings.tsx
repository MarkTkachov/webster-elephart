import { useUserStore } from '@/entities/user';
import { useState } from 'react';
import MainLayout from '../MainLayout';
import HomeLayout from './HomeLayout';
import { PrivateLayout } from '../PrivateLayout';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { passwordRegex } from '@/shared/lib/passwordRegex';

const Settings = () => {
    const user = useUserStore((state) => state.user);
    const [activeTab, setActiveTab] = useState(
        user?.isRegisteredViaGoogle ? 'Google Account' : 'Account',
    );

    const updateInfoUser = useUserStore((state) => state.updateInfoUser);
    const updatePassword = useUserStore((state) => state.updatePassword);
    const logoutUser = useUserStore((state) => state.logoutUser);
    const updateAvatar = useUserStore((state) => state.updateAvatar);
    const deleteUser = useUserStore((state) => state.deleteUser);
    const navigate = useNavigate();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [username, setUsername] = useState(user?.userName);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [profilePic, setProfilePic] = useState(user?.profilePicture);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveChanges = async () => {
        let updateUser = false;

        if (username && username !== user?.userName) {
            await updateInfoUser(username);
            updateUser = true;
        }

        if (selectedFile) {
            await updateAvatar(selectedFile);
            updateUser = true;
        }

        if (updateUser) navigate('/settings');
    };

    const handleDeleteAccount = async () => {
        await deleteUser();
        navigate('/home', { replace: true });
        window.location.reload();
    };

    const handleSavePassword = async () => {
        const trimmedCurrentPassword = currentPassword.trim();
        const trimmedNewPassword = newPassword.trim();

        if (
            trimmedCurrentPassword &&
            trimmedNewPassword &&
            trimmedCurrentPassword !== trimmedNewPassword
        ) {
            if (!passwordRegex.test(trimmedNewPassword)) {
                setPasswordError(
                    'Password must be at least 8 characters long, contain at least one letter, one number, and one special character.',
                );
                return;
            } else {
                setPasswordError('');
                await updatePassword(
                    trimmedCurrentPassword,
                    trimmedNewPassword,
                );
                await logoutUser();
                navigate('/home', { replace: true });
                window.location.reload();
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result && typeof reader.result === 'string') {
                    setProfilePic(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInputClick = () => {
        const fileInput = document.getElementById(
            'profile-picture',
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    };

    return (
        <MainLayout>
            <HomeLayout>
                <PrivateLayout>
                    <div className="flex h-full w-full pl-4 pr-2 pt-4">
                        <div className="h-full w-full rounded-t-lg bg-background">
                            <div className="mx-auto mt-10 max-w-xl rounded-lg border p-4 shadow-md">
                                {!user?.isRegisteredViaGoogle && (
                                    <>
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                className={`w-full rounded-t-lg px-4 py-2 text-lg font-semibold transition-colors duration-300 focus:outline-none ${
                                                    activeTab === 'Account'
                                                        ? 'bg-gray-200 shadow-md'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                                onClick={() =>
                                                    setActiveTab('Account')
                                                }
                                            >
                                                Account
                                            </button>
                                            <button
                                                className={`w-full rounded-t-lg px-4 py-2 text-lg font-semibold transition-colors duration-300 focus:outline-none ${
                                                    activeTab === 'Password'
                                                        ? 'bg-gray-200 shadow-md'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                                onClick={() =>
                                                    setActiveTab('Password')
                                                }
                                            >
                                                Password
                                            </button>
                                        </div>
                                        {activeTab === 'Account' && (
                                            <div className="border-t-2 border-gray-200 bg-white p-4 ">
                                                <h2 className="text-xl font-bold ">
                                                    Account
                                                </h2>
                                                <p className="mb-4">
                                                    Make changes to your account
                                                    here. Click save when you're
                                                    done.
                                                </p>
                                                <div className="flex">
                                                    <div
                                                        onClick={
                                                            triggerFileInputClick
                                                        }
                                                        className="mr-4 cursor-pointer"
                                                    >
                                                        <img
                                                            src={
                                                                profilePic
                                                                    ? profilePic
                                                                    : 'src/public/bg-logo.png'
                                                            }
                                                            alt="Profile"
                                                            height={230}
                                                            width={230}
                                                            className="rounded-lg"
                                                            style={{
                                                                objectFit:
                                                                    'cover',
                                                                objectPosition:
                                                                    'center',
                                                            }}
                                                        />
                                                        <input
                                                            type="file"
                                                            id="profile-picture"
                                                            accept="image/*"
                                                            onChange={
                                                                handleImageChange
                                                            }
                                                            className="hidden"
                                                        />
                                                    </div>

                                                    <div className="mt-8 flex flex-grow flex-col">
                                                        <input
                                                            type="email"
                                                            value={user?.email}
                                                            className="mb-2 w-full rounded border bg-gray-100 p-2 text-gray-400"
                                                            placeholder="Email"
                                                            disabled
                                                        />
                                                        <input
                                                            type="text"
                                                            value={username}
                                                            onChange={(e) =>
                                                                setUsername(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="mb-6 w-full rounded border p-2"
                                                            placeholder="Username"
                                                        />
                                                        <button
                                                            onClick={
                                                                handleSaveChanges
                                                            }
                                                            className="w-full rounded  bg-black py-2 font-semibold text-white"
                                                        >
                                                            Save changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {activeTab === 'Password' && (
                                            <div className="border-t-2 border-gray-200 bg-white p-4 ">
                                                <h2 className="text-xl font-bold ">
                                                    Password
                                                </h2>
                                                <p className="mb-4">
                                                    Change your password here.
                                                    After saving, you'll be
                                                    logged out.
                                                </p>
                                                {passwordError && (
                                                    <p className="mb-4 text-red-500">
                                                        {passwordError}
                                                    </p>
                                                )}
                                                <div className="flex flex-col items-center">
                                                    <div className="w-1/2">
                                                        <div className="relative mb-2">
                                                            <input
                                                                type={
                                                                    showCurrentPassword
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                value={
                                                                    currentPassword
                                                                }
                                                                onChange={(e) =>
                                                                    setCurrentPassword(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded border p-2"
                                                                placeholder="Current Password"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setShowCurrentPassword(
                                                                        !showCurrentPassword,
                                                                    )
                                                                }
                                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
                                                            >
                                                                {showCurrentPassword ? (
                                                                    <EyeOff
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <Eye
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                )}
                                                            </button>
                                                        </div>
                                                        <div className="relative mb-6">
                                                            <input
                                                                type={
                                                                    showNewPassword
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                value={
                                                                    newPassword
                                                                }
                                                                onChange={(e) =>
                                                                    setNewPassword(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded border p-2"
                                                                placeholder="New Password"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setShowNewPassword(
                                                                        !showNewPassword,
                                                                    )
                                                                }
                                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
                                                            >
                                                                {showNewPassword ? (
                                                                    <EyeOff
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <Eye
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                )}
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={
                                                                handleSavePassword
                                                            }
                                                            className="w-full rounded  bg-black py-2 font-semibold text-white"
                                                        >
                                                            Save password
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                {user?.isRegisteredViaGoogle && (
                                    <>
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                className={`w-full rounded-t-lg px-4 py-2 text-lg font-semibold transition-colors duration-300 focus:outline-none ${
                                                    activeTab === 'Account'
                                                        ? 'bg-gray-200 shadow-md'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                                onClick={() =>
                                                    setActiveTab(
                                                        'Google Account',
                                                    )
                                                }
                                            >
                                                Google Account
                                            </button>
                                        </div>
                                        {activeTab === 'Google Account' && (
                                            <div className="border-t-2 border-gray-200 bg-white p-4">
                                                <h2 className="text-xl font-bold">
                                                    Google Account
                                                </h2>
                                                <p className="mb-4">
                                                    To change your information,
                                                    please go to your Google
                                                    account.
                                                </p>
                                                <div className="mt-6 flex justify-center">
                                                    <a
                                                        href="https://myaccount.google.com/personal-info"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-1/2 rounded bg-black py-2 text-center font-semibold text-white"
                                                    >
                                                        Go to Google Account
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-1/5 rounded bg-red-500 py-2 font-semibold text-white"
                                >
                                    DELETE ACCOUNT
                                </button>
                            </div>
                        </div>
                    </div>
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="rounded-lg bg-white p-6 shadow-lg">
                                <h2 className="mb-4 text-center text-xl font-bold">
                                    Are you sure you want to delete your
                                    account?
                                </h2>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="rounded bg-gray-300 px-4 py-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDeleteAccount();
                                        }}
                                        className="rounded bg-red-500 px-4 py-2 text-white"
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </PrivateLayout>
            </HomeLayout>
        </MainLayout>
    );
};

export default Settings;
