import axios from 'axios';
import { API_URL } from '../index';

export async function loginUser(email: string, password: string) {
    const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true },
    );
    return response.data;
}
