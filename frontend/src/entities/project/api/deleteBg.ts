import { API_URL, useProjectStore } from '@/entities/project';
import $api from '@/app/http/axios';

export async function deleteBg(src: string) {
    // console.log('src', src);
    const id = useProjectStore.getState().project?._id;
    if (!id) return;
    try {
        const response = await $api.post(
            `${API_URL}/project/remove-background`,
            { imageUrl: src, id },
        );
        return response.data;
    } catch (e) {
        console.error(e);
    }
}
