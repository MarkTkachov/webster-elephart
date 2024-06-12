import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { getProjects } from '../api/getProjects';

export interface IProject {
    _id: string;
    title: string;
    projectJSON?: string;
    thumbbnail?: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
}
import {
    getUser,
    loginUser,
    regUser,
    signUpGoogle,
    logout,
    updateInfo,
    changePassword,
    updateProfilePicture,
    deleteAccount,
} from '../index';
import { deleteProject, updateProject } from '@/entities/project';

interface User {
    _id: number;
    userName: string;
    email: string;
    profilePicture: string;
    emailVerified: boolean;
    isRegisteredViaGoogle: boolean;
    role: string;
}

interface IUserStoreData {
    user: User | null;
    isLoaded: boolean;
    isLogin: boolean;
    checked: boolean;
    projects: IProject[] | null;
}

interface IUserStoreActions {
    resetStore: VoidFunction;
    setProjects: (projects: [] | null) => void;
    setUser: (user: User | null) => void;
    loginUser: (email: string, password: string) => void;
    loginGoogle: () => void;
    registerUser: (email: string, password: string) => void;
    checkAuth: () => object | null;
    logoutUser: () => Promise<void>;
    updateProject: (title: string, id: string) => void;
    deleteProject: (id: string) => void;
    updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    updateInfoUser: (userName: string) => Promise<void>;
    updateAvatar: (newPicture: any) => Promise<void>;
    deleteUser: () => Promise<void>;
}

const initState = {
    user: null,
    isLoaded: false,
    isLogin: false,
    checked: false,
    projects: null,
};

export const useUserStore = create<IUserStoreData & IUserStoreActions>()(
    devtools(
        immer((set) => ({
            ...initState,
            resetStore: () => {
                set({ ...initState });
            },
            setProjects: (projects) => set({ projects }),
            updateProject: async (title, id) => {
                try {
                    const response = await updateProject(title, id);
                    const setProjects = useUserStore.getState().setProjects;
                    const projects = useUserStore.getState().projects ?? [];
                    if (response) {
                        const updatedProjects = projects.map((project) => {
                            if (project._id === id) {
                                return { ...project, title };
                            }
                            return project;
                        });
                        setProjects(updatedProjects as []);
                    }
                } catch (error) {
                    console.error(error);
                }
            },
            deleteProject: async (id) => {
                try {
                    const response = await deleteProject(id);
                    const setProjects = useUserStore.getState().setProjects;
                    const projects = useUserStore.getState().projects ?? [];
                    if (response) {
                        const updatedProjects = projects.filter(
                            (project) => project._id !== id,
                        );
                        setProjects(updatedProjects as []);
                    }
                } catch (error) {
                    console.error(error);
                }
            },
            setUser: (user) => set({ user }),
            loginUser: async (email, password) => {
                try {
                    const response = await loginUser(email, password);
                    const user = response;
                    if (user) {
                        set({ user });
                        set({ isLogin: true });
                    }
                } catch (error) {
                    console.error(error);
                }
                set({ isLoaded: true });
                useUserStore.getState().checkAuth();
            },
            registerUser: async (email, password) => {
                try {
                    const response = await regUser(email, password);
                    const user = response;
                    if (user) {
                        set({ user });
                        set({ isLogin: true });
                    }
                } catch (error) {
                    console.error(error);
                }
                set({ isLoaded: true });
            },
            checkAuth: async () => {
                try {
                    const response = await getUser();
                    const projects = await getProjects();
                    const user = response;
                    if (user) {
                        set({ user });
                        set({ isLogin: true });
                    }
                    set({ isLoaded: true });
                    set({ checked: true });
                    set({ projects });
                    return user;
                } catch (error) {
                    console.error(error);
                }
                set({ isLoaded: true });
                set({ checked: true });
                return null;
            },
            loginGoogle: async () => {
                try {
                    const response = await signUpGoogle();
                    const user = response;
                    if (user) {
                        set({ user });
                        set({ isLogin: true });
                    }
                } catch (error) {
                    console.error(error);
                }
                set({ isLoaded: true });
            },

            logoutUser: async () => {
                try {
                    await logout();
                    set({ user: null, isLogin: false });
                } catch (error) {
                    console.error(error);
                }
            },

            updatePassword: async (oldPassword, newPassword) => {
                try {
                    await changePassword(oldPassword, newPassword);
                } catch (error) {
                    console.error(error);
                }
                set({ isLoaded: true });
            },

            updateInfoUser: async (userName) => {
                try {
                    const response = await updateInfo(userName);
                    const user = response;
                    if (user) set({ user });
                } catch (error) {
                    console.error(error);
                }
                set({ isLoaded: true });
            },

            updateAvatar: async (newPicture: any) => {
                try {
                    const response = await updateProfilePicture(newPicture);
                    const userProfile = response;
                    if (userProfile)
                        set((state: any) => ({
                            user: {
                                ...state.user,
                                profilePicture: userProfile.profilePicture,
                            },
                        }));
                } catch (error) {
                    console.error(error);
                }
                set({ isLoaded: true });
            },

            deleteUser: async () => {
                try {
                    const response = await deleteAccount();
                    if (response.status == 200)
                        set({ user: null, isLogin: false });
                } catch (error) {
                    console.error(error);
                }
                set({ isLoaded: true });
            },
        })),
    ),
);
