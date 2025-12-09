import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const cartData = await cartService.getCart();
            setCart(cartData);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1, selectedColor = null, selectedSize = null) => {
        try {
            const updatedCart = await cartService.addToCart(productId, quantity, selectedColor, selectedSize);
            setCart(updatedCart);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to add to cart' };
        }
    };

    const updateCartItem = async (itemId, quantity) => {
        try {
            const updatedCart = await cartService.updateCartItem(itemId, quantity);
            setCart(updatedCart);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to update cart' };
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const updatedCart = await cartService.removeFromCart(itemId);
            setCart(updatedCart);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to remove item' };
        }
    };

    const clearCart = async () => {
        try {
            await cartService.clearCart();
            setCart({ items: [], total: 0 });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to clear cart' };
        }
    };

    const getCartItemCount = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        if (!cart) return 0;
        return cart.total || 0;
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
        cartItemCount: getCartItemCount(),
        cartTotal: getCartTotal()
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
