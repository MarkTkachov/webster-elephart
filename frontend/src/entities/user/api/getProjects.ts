import $api from '@/app/http/axios';
import { API_URL } from '../index';

export async function getProjects() {
    const response = await $api.get(`${API_URL}/project/myProjects`);
    return response.data;
}
