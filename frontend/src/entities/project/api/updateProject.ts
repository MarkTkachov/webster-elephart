import $api from '@/app/http/axios';
export const updateProject = async (title: string, id: string) => {

    const response = await $api.patch(`/project/${id}`, {
        title,
    });
    return response.data;
};
