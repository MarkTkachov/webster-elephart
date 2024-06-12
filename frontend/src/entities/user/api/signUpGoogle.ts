import axios from 'axios';
import { API_URL } from '../index';

export async function signUpGoogle() {
    const response = await axios.get(`${API_URL}/auth/google`, {
        withCredentials: true,
    });
    return response.data;
}


export async function signUpGoogleCallback(code: string) {
    const response = await axios.get(`${API_URL}/auth/google/callback`, {
        params: {
            code: code 
        },
        withCredentials: true,
    });
    return response;
}