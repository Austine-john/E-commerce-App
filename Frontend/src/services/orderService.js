import api from '../config/api';

export const orderService = {
    async createOrder(orderData) {
        const response = await api.post('/orders', orderData);
        return response.data.order;
    },

    async getOrders() {
        const response = await api.get('/orders');
        return response.data;
    },

    async getOrderById(id) {
        const response = await api.get(`/orders/${id}`);
        return response.data.order;
    }
};
