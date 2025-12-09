import React, { useEffect } from 'react';
import { useProducts } from '../Context/ProductContext';
import ProductCard from '../components/ProductCard/ProductCard';
import './ShopCategory.css';

export default function ShopCategory({ category }) {
    const { products, fetchProducts, loading } = useProducts();

    useEffect(() => {
        fetchProducts(category);
    }, [category]);

    const getCategoryTitle = () => {
        switch (category) {
            case 'makeup': return 'Makeup';
            case 'mobile-accessories': return 'Mobile Accessories';
            case 'shoes-clothes': return 'Shoes & Clothes';
            default: return 'Products';
        }
    };

    return (
        <div className="shop-category-page">
            {/* Category Banner */}
            <div className="category-banner">
                <div className="container">
                    <h1>{getCategoryTitle()}</h1>
                    <p>Discover our collection of premium {getCategoryTitle().toLowerCase()}</p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container">
                <div className="category-content">
                    <div className="category-header">
                        <p className="results-count">
                            {loading ? 'Loading...' : `${products.length} products`}
                        </p>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="products-grid">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-products">
                            <p>No products found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}