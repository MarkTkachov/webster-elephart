import $api from '@/app/http/axios';
import { API_URL } from '../index';

export async function deleteAccount() {
    const response = await $api.delete(`${API_URL}/user/delete-profile`, {
        withCredentials: true,
    });
    return response;
}
