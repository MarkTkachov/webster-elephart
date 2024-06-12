import $api from '@/app/http/axios';
import { API_URL, useProjectStore } from '@/entities/project';
import Konva from 'konva';

export async function saveProject(stage: Konva.Stage) {
    try {
        const id = useProjectStore.getState().project?._id;
        if (!id || id == 'tmp') return;
        await $api.patch(`${API_URL}/project/${id}`, {
            projectJSON: stage.toJSON(),
        });
        const stageClone = stage.clone();
        const desiredSize = 200;
        const width = stageClone.width();
        const height = stageClone.height();
        const scale = Math.min(desiredSize / width, desiredSize / height);
        await stageClone.toBlob({
            pixelRatio: scale,
            mimeType: 'image/jpg',
            quality: 0.3,
            callback: async (blob) => {
                if (!blob) return;
                const fd = new FormData();
                fd.append('image', blob);
                await $api.patch(`/project/${id}/thumbnail`, fd);
                stageClone.destroy();
            },
        });
    } catch (error) {
        console.error(error);
    }
}
