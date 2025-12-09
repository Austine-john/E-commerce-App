import api from '../config/api';

export const paymentService = {
    async initiateMpesaPayment(orderId, phoneNumber) {
        const response = await api.post('/payments/mpesa/initiate', {
            order_id: orderId,
            phone_number: phoneNumber
        });
        return response.data;
    },

    async checkPaymentStatus(orderId) {
        const response = await api.get(`/payments/${orderId}/status`);
        return response.data;
    },

    async simulatePaymentSuccess(orderId) {
        const response = await api.post(`/payments/mpesa/simulate-success/${orderId}`);
        return response.data;
    }
};
