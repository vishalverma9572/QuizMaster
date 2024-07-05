import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Change this to your backend URL
});

export const signUp = (userData) => api.post('/auth/signup', userData);
export const signIn = (userData) => api.post('/auth/signin', userData);
