import api from './axios';

const baseURL = process.env.REACT_APP_POST_API_URL
    || (process.env.NODE_ENV === 'development' ? 'http://localhost:8001/api/' : api.defaults.baseURL);

export const getPost = () => api.get('/posts', { baseURL });

export const storePost = (data) => api.post('/posts', data, { baseURL });
