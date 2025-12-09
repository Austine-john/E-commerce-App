import api from '../config/api';

export const categoryService = {
    async getCategories() {
        const response = await api.get('/categories');
        return response.data;
    }
};
