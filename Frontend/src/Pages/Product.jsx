import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiShield, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { useProducts } from '../Context/ProductContext';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext';
import ProductCard from '../components/ProductCard/ProductCard';
import './Product.css';

export default function Product() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { getProductById, featuredProducts } = useProducts();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        loadProduct();
    }, [productId]);

    const loadProduct = async () => {
        setLoading(true);
        const productData = await getProductById(productId);
        if (productData) {
            setProduct(productData);
            if (productData.color_options && productData.color_options.length > 0) {
                setSelectedColor(productData.color_options[0]);
            }
            if (productData.size_options && productData.size_options.length > 0) {
                setSelectedSize(productData.size_options[0]);
            }
        }
        setLoading(false);
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        await addToCart(product.id, quantity, selectedColor, selectedSize);
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        await addToCart(product.id, quantity, selectedColor, selectedSize);
        navigate('/checkout');
    };

    const images = product?.additional_images?.length > 0
        ? [product.image_url, ...product.additional_images]
        : [product?.image_url];

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Product not found</h2>
            </div>
        );
    }

    return (
        <div className="product-page">
            {/* Breadcrumb */}
            <div className="container">
                <div className="breadcrumb">
                    <span onClick={() => navigate('/')}>Home</span>
                    <span>/</span>
                    <span onClick={() => navigate(`/${product.category?.slug}`)}>
                        {product.category?.name}
                    </span>
                    <span>/</span>
                    <span>{product.name}</span>
                </div>
            </div>

            {/* Product Detail */}
            <div className="container">
                <div className="product-detail">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img src={images[selectedImage] || product.image_url} alt={product.name} />
                        </div>
                        {images.length > 1 && (
                            <div className="thumbnail-images">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={img} alt={`${product.name} ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info-detail">
                        <h1>{product.name}</h1>
                        <p className="product-tagline">{product.description}</p>

                        <div className="product-price-detail">
                            <span className="current-price">KSh {product.price.toLocaleString()}</span>
                            {product.old_price && (
                                <span className="old-price">KSh {product.old_price.toLocaleString()}</span>
                            )}
                        </div>

                        {/* Color Selector */}
                        {product.color_options && product.color_options.length > 0 && (
                            <div className="product-option">
                                <label>Color: <strong>{selectedColor}</strong></label>
                                <div className="color-options">
                                    {product.color_options.map((color) => (
                                        <button
                                            key={color}
                                            className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                            style={{
                                                backgroundColor: color.toLowerCase() === 'black' ? '#000' :
                                                    color.toLowerCase() === 'white' ? '#fff' :
                                                        color.toLowerCase() === 'nude' ? '#E8B4A0' :
                                                            color.toLowerCase() === 'beige' ? '#F5F5DC' :
                                                                color.toLowerCase() === 'brown' ? '#8B4513' :
                                                                    color.toLowerCase() === 'red' ? '#DC143C' :
                                                                        color.toLowerCase() === 'pink' ? '#FFC0CB' :
                                                                            color.toLowerCase() === 'green' ? '#00A651' :
                                                                                color.toLowerCase() === 'onyx black' ? '#353839' :
                                                                                    color.toLowerCase() === 'silver' ? '#C0C0C0' :
                                                                                        '#ccc',
                                                border: color.toLowerCase() === 'white' ? '2px solid #ddd' : 'none'
                                            }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selector */}
                        {product.size_options && product.size_options.length > 0 && (
                            <div className="product-option">
                                <label>Size</label>
                                <div className="size-options">
                                    {product.size_options.map((size) => (
                                        <button
                                            key={size}
                                            className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="product-option">
                            <label>Quantity</label>
                            <div className="quantity-controls">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <input type="number" value={quantity} readOnly />
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="product-actions">
                            <button className="btn-add-to-cart" onClick={handleAddToCart}>
                                <FiShoppingCart size={20} />
                                Add to Cart
                            </button>
                            <button className="btn-buy-now" onClick={handleBuyNow}>
                                Buy Now
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="trust-badges">
                            <div className="badge">
                                <FiShield size={20} />
                                <span>Secure Payment</span>
                            </div>
                            <div className="badge">
                                <FiTruck size={20} />
                                <span>Fast Delivery in Kenya</span>
                            </div>
                            <div className="badge">
                                <FiCheckCircle size={20} />
                                <span>Authentic Products</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Tabs */}
                <div className="product-tabs">
                    <div className="tab-headers">
                        <button
                            className={activeTab === 'description' ? 'active' : ''}
                            onClick={() => setActiveTab('description')}
                        >
                            Product Description
                        </button>
                        <button
                            className={activeTab === 'specifications' ? 'active' : ''}
                            onClick={() => setActiveTab('specifications')}
                        >
                            Specifications
                        </button>
                        <button
                            className={activeTab === 'reviews' ? 'active' : ''}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Customer Reviews (0)
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <div className="tab-pane">
                                <p>{product.description || 'No description available.'}</p>
                                <p>
                                    Elevate your wardrobe with {product.name}, a masterpiece of local Kenyan craftsmanship.
                                    Designed for the modern individual who values both style and comfort, this product is
                                    versatile enough for any occasion.
                                </p>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div className="tab-pane">
                                <ul>
                                    <li><strong>Category:</strong> {product.category?.name}</li>
                                    <li><strong>Stock:</strong> {product.stock} units available</li>
                                    {product.color_options?.length > 0 && (
                                        <li><strong>Available Colors:</strong> {product.color_options.join(', ')}</li>
                                    )}
                                    {product.size_options?.length > 0 && (
                                        <li><strong>Available Sizes:</strong> {product.size_options.join(', ')}</li>
                                    )}
                                </ul>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="tab-pane">
                                <p>No reviews yet. Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* You Might Also Like */}
                <div className="related-products">
                    <h2>You Might Also Like</h2>
                    <div className="products-grid">
                        {featuredProducts.slice(0, 4).map((relatedProduct) => (
                            <ProductCard key={relatedProduct.id} product={relatedProduct} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}