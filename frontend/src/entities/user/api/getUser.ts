import { API_URL } from '../index';
import $api from '@/app/http/axios';

export async function getUser() {
    const response = await $api.post(
        `${API_URL}/auth/refreshToken`,
        {},
        { withCredentials: true },
    );
    // console.log(response.data);
    return response.data;
}
