import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
    return (
        <div className="hero">
            <div className="hero-overlay">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Glow Up! 20% Off All Makeup
                        </h1>
                        <p className="hero-subtitle">
                            Discover our latest collection of premium makeup products, proudly Kenyan.
                            <br />
                            Unleash your inner beauty with shades that celebrate you.
                        </p>
                        <Link to="/makeup" className="hero-btn">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}