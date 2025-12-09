import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import './Checkout.css';

export default function Checkout() {
    const navigate = useNavigate();
    const { cart, cartTotal } = useCart();
    const { user, isAuthenticated } = useAuth();

    const [step, setStep] = useState(1);
    const [deliveryFee] = useState(500);
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        phone_number: user?.phone_number || '',
        county: '',
        town: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
        if (!cart || cart.items?.length === 0) {
            navigate('/cart');
        }
    }, [isAuthenticated, cart]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        // This would call updateCartItem from context
        console.log('Update quantity:', itemId, newQuantity);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const orderData = {
                ...formData,
                delivery_fee: deliveryFee,
                payment_method: 'mpesa'
            };

            const order = await orderService.createOrder(orderData);
            setOrderId(order.id);
            setStep(3);
        } catch (error) {
            alert('Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await paymentService.initiateMpesaPayment(orderId, formData.phone_number);

            // Simulate payment success after 2 seconds (placeholder)
            setTimeout(async () => {
                await paymentService.simulatePaymentSuccess(orderId);
                setPaymentStatus('success');

                // Redirect to home after 3 seconds
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }, 2000);
        } catch (error) {
            setPaymentStatus('failed');
            alert('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const total = cartTotal + deliveryFee;

    if (!cart || !cart.items) {
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <span onClick={() => navigate('/')}>Home</span>
                    <span>/</span>
                    <span onClick={() => navigate('/cart')}>Shopping Cart</span>
                    <span>/</span>
                    <span>Checkout</span>
                </div>

                <h1>Checkout</h1>

                {/* Progress Steps */}
                <div className="checkout-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Cart Review</div>
                    </div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Delivery Details</div>
                    </div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <div className="step-label">Payment</div>
                    </div>
                </div>

                <div className="checkout-content">
                    <div className="checkout-main">
                        {/* Step 1: Cart Review */}
                        {step === 1 && (
                            <div className="checkout-section">
                                <h2>My Cart ({cart.items.length} items)</h2>
                                <div className="cart-items-table">
                                    <div className="table-header">
                                        <div>Product</div>
                                        <div>Price</div>
                                        <div>Quantity</div>
                                        <div>Subtotal</div>
                                    </div>
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="cart-item-row">
                                            <div className="item-product">
                                                <img src={item.product.image_url} alt={item.product.name} />
                                                <div>
                                                    <h4>{item.product.name}</h4>
                                                    {item.selected_color && <p>Shade: {item.selected_color}</p>}
                                                    {item.selected_size && <p>Size: {item.selected_size}</p>}
                                                </div>
                                            </div>
                                            <div className="item-price">
                                                KES {item.product.price.toLocaleString()}
                                            </div>
                                            <div className="item-quantity">
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                            <div className="item-subtotal">
                                                KES {item.subtotal.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-next" onClick={() => setStep(2)}>
                                    Continue to Delivery Details
                                </button>
                            </div>
                        )}

                        {/* Step 2: Delivery Details */}
                        {step === 2 && (
                            <div className="checkout-section">
                                <h2>Where should we deliver?</h2>
                                <form className="delivery-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                name="full_name"
                                                placeholder="e.g., Jomo Kenyatta"
                                                value={formData.full_name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone Number (for M-Pesa)</label>
                                            <input
                                                type="tel"
                                                name="phone_number"
                                                placeholder="+254 712 345 678"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>County</label>
                                            <select
                                                name="county"
                                                value={formData.county}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select County</option>
                                                <option value="Nairobi">Nairobi</option>
                                                <option value="Mombasa">Mombasa</option>
                                                <option value="Kisumu">Kisumu</option>
                                                <option value="Nakuru">Nakuru</option>
                                                <option value="Kiambu">Kiambu</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Town / City</label>
                                            <input
                                                type="text"
                                                name="town"
                                                placeholder="e.g., Westlands"
                                                value={formData.town}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Street / Building / Apartment Details</label>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="e.g., Chiromo Lane, The Nest, Apt 5B"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </form>

                                <div className="form-actions">
                                    <button className="btn-back" onClick={() => setStep(1)}>
                                        Back to Cart
                                    </button>
                                    <button className="btn-next" onClick={() => setStep(3)}>
                                        Continue to Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <div className="checkout-section">
                                <h2>Choose your payment method</h2>

                                <div className="payment-method">
                                    <div className="payment-option selected">
                                        <input type="radio" name="payment" checked readOnly />
                                        <label>Pay with M-Pesa</label>
                                        <div className="mpesa-badge">
                                            <FiCheckCircle size={20} color="#00A651" />
                                        </div>
                                    </div>

                                    <div className="mpesa-payment-box">
                                        <p className="mpesa-info">
                                            An STK push will be sent to your M-Pesa registered phone number to complete the payment.
                                        </p>

                                        <div className="mpesa-details">
                                            <p>A pop-up will be sent to:</p>
                                            <h3>{formData.phone_number}</h3>
                                        </div>

                                        {paymentStatus === 'pending' && (
                                            <button
                                                className="btn-pay"
                                                onClick={handlePlaceOrder}
                                                disabled={loading || orderId}
                                            >
                                                {loading ? 'Processing...' : orderId ? `Pay KES ${total.toLocaleString()}` : 'Place Order & Pay'}
                                            </button>
                                        )}

                                        {orderId && paymentStatus === 'pending' && (
                                            <button
                                                className="btn-pay"
                                                onClick={handlePayment}
                                                disabled={loading}
                                            >
                                                {loading ? 'Sending STK Push...' : `Pay KES ${total.toLocaleString()}`}
                                            </button>
                                        )}

                                        {paymentStatus === 'success' && (
                                            <div className="payment-success">
                                                <FiCheckCircle size={48} color="#4CAF50" />
                                                <h3>Payment Successful!</h3>
                                                <p>Redirecting to home...</p>
                                            </div>
                                        )}

                                        {paymentStatus === 'failed' && (
                                            <div className="payment-failed">
                                                <p>Payment failed. Please try again.</p>
                                            </div>
                                        )}

                                        <p className="mpesa-instruction">
                                            Please enter your M-Pesa PIN on your phone to authorize.
                                        </p>

                                        <div className="payment-badges">
                                            <div className="badge">
                                                <FiShield size={16} />
                                                <span>Secure Payment</span>
                                            </div>
                                            <div className="badge">
                                                <FiCheckCircle size={16} />
                                                <span>M-Pesa Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="order-summary">
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
                    </div>
                </div>
            </div>
        </div>
    );
}
