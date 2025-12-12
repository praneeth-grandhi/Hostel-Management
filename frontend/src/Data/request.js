import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

export const REGISTER_USER = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}register/`, userData);
    return response.data;
}

export const LOGIN_USER = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}login/`, userData);
    return response.data;
}

export const FETCH_HOSTELS = async () => {
    const response = await axios.get(`${API_BASE_URL}hostels/`);
    return response.data;
}
