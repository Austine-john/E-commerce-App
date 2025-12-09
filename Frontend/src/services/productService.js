import api from '../config/api';

export const productService = {
    async getProducts(categorySlug = null) {
        const params = categorySlug ? { category: categorySlug } : {};
        const response = await api.get('/products', { params });
        return response.data;
    },

    async getProductById(id) {
        const response = await api.get(`/products/${id}`);
        return response.data.product;
    },

    async getFeaturedProducts() {
        const response = await api.get('/products/featured');
        return response.data;
    },

    async getProductsByCategory(slug) {
        const response = await api.get(`/products/category/${slug}`);
        return response.data;
    }
};
