import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

export default function CategoryCard({ category }) {
    return (
        <Link to={`/${category.slug}`} className="category-card">
            <div className="category-image">
                <img src={category.image_url || '/placeholder-category.jpg'} alt={category.name} />
                <div className="category-overlay">
                    <h3 className="category-name">{category.name}</h3>
                </div>
            </div>
        </Link>
    );
}
