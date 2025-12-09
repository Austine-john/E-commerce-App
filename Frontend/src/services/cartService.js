import api from '../config/api';

export const cartService = {
    async getCart() {
        const response = await api.get('/cart');
        return response.data.cart;
    },

    async addToCart(productId, quantity = 1, selectedColor = null, selectedSize = null) {
        const response = await api.post('/cart/add', {
            product_id: productId,
            quantity,
            selected_color: selectedColor,
            selected_size: selectedSize
        });
        return response.data.cart;
    },

    async updateCartItem(itemId, quantity) {
        const response = await api.put(`/cart/update/${itemId}`, { quantity });
        return response.data.cart;
    },

    async removeFromCart(itemId) {
        const response = await api.delete(`/cart/remove/${itemId}`);
        return response.data.cart;
    },

    async clearCart() {
        const response = await api.delete('/cart/clear');
        return response.data;
    }
};
