import $api from '@/app/http/axios';
export const deleteProject = async (id: string) => {
    const response = await $api.delete(`/project/${id}`);
    return response.data;
};
