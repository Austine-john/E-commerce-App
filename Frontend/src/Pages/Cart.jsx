import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart() {
    const navigate = useNavigate();
    const { cart, updateCartItem, removeFromCart, cartTotal, loading } = useCart();
    const { isAuthenticated } = useAuth();

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateCartItem(itemId, newQuantity);
    };

    const handleRemove = async (itemId) => {
        await removeFromCart(itemId);
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <FiShoppingBag size={64} color="#ccc" />
                        <h2>Your cart is empty</h2>
                        <p>Add some products to get started!</p>
                        <button className="btn-primary" onClick={() => navigate('/')}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const deliveryFee = 500;
    const total = cartTotal + deliveryFee;

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Shopping Cart ({cart.items.length} items)</h1>

                <div className="cart-content">
                    <div className="cart-items">
                        {cart.items.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.product.image_url} alt={item.product.name} />

                                <div className="item-details">
                                    <h3>{item.product.name}</h3>
                                    {item.selected_color && (
                                        <p className="item-variant">Color: {item.selected_color}</p>
                                    )}
                                    {item.selected_size && (
                                        <p className="item-variant">Size: {item.selected_size}</p>
                                    )}
                                    <p className="item-price">KES {item.product.price.toLocaleString()}</p>
                                </div>

                                <div className="item-actions">
                                    <div className="quantity-control">
                                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                            +
                                        </button>
                                    </div>

                                    <p className="item-subtotal">
                                        KES {item.subtotal.toLocaleString()}
                                    </p>

                                    <button
                                        className="btn-remove"
                                        onClick={() => handleRemove(item.id)}
                                        title="Remove item"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>KES {cartTotal.toLocaleString()}</span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span>KES {deliveryFee.toLocaleString()}</span>
                        </div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span>KES {total.toLocaleString()}</span>
                        </div>

                        <button className="btn-checkout" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>

                        <button className="btn-continue" onClick={() => navigate('/')}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}