import React, { createContext, useState, useContext, useEffect } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchFeaturedProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async (categorySlug = null) => {
        try {
            setLoading(true);
            const data = await productService.getProducts(categorySlug);
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFeaturedProducts = async () => {
        try {
            const data = await productService.getFeaturedProducts();
            setFeaturedProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching featured products:', error);
        }
    };

    const getProductById = async (id) => {
        try {
            const product = await productService.getProductById(id);
            return product;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    };

    const value = {
        products,
        categories,
        featuredProducts,
        loading,
        fetchProducts,
        fetchFeaturedProducts,
        getProductById
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
