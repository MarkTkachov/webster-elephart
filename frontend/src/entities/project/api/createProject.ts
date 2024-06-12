import $api from '@/app/http/axios';
export const createProject = async (title: string) => {
    const response = await $api.post('/project/create', {
        title,
    });
    return response.data;
};
