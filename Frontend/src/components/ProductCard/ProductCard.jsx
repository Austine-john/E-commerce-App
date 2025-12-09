import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../../Context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        await addToCart(product.id, 1);
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-image-link">
                <div className="product-image">
                    <img src={product.image_url || '/placeholder-product.jpg'} alt={product.name} />
                    <button className="favorite-btn" onClick={(e) => e.preventDefault()}>
                        <FiHeart size={20} />
                    </button>
                </div>
            </Link>

            <div className="product-info">
                <Link to={`/product/${product.id}`} className="product-name">
                    {product.name}
                </Link>

                {product.description && (
                    <p className="product-description">{product.description}</p>
                )}

                <div className="product-price">
                    <span className="current-price">KSh {product.price.toLocaleString()}</span>
                    {product.old_price && (
                        <span className="old-price">KSh {product.old_price.toLocaleString()}</span>
                    )}
                </div>

                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    <FiShoppingCart size={18} />
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
