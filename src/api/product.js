import api from './axios';

export const getProducts = async (page = 1, search = '') => {
    return api.get('/products', {
        params: { page, search },
    });
};

export const storeProduct = async (formData) => {
    return api.post('/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
