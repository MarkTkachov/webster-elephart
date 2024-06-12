import $api from '@/app/http/axios';

export async function logoutUser() {
    return await $api.post('/auth/logout');
}
