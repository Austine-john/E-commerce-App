import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Newsletter Section */}
                    <div className="footer-section newsletter-section">
                        <h3>Stay in Touch</h3>
                        <p>Get the latest on new arrivals, sales, and more. Proudly Kenyan!</p>
                        <form className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="newsletter-input"
                            />
                            <button type="submit" className="newsletter-btn">Subscribe</button>
                        </form>
                    </div>

                    {/* Customer Service */}
                    <div className="footer-section">
                        <h4>Customer Service</h4>
                        <ul className="footer-links">
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/shipping">Shipping & Returns</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Company Info */}
                    <div className="footer-section">
                        <h4>Company Info</h4>
                        <ul className="footer-links">
                            <li><Link to="/about">About AfroChic</Link></li>
                            <li><Link to="/careers">Careers</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div className="footer-section">
                        <h4>Follow Us</h4>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook"><FiFacebook size={24} /></a>
                            <a href="#" aria-label="Instagram"><FiInstagram size={24} /></a>
                            <a href="#" aria-label="Twitter"><FiTwitter size={24} /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 AfroChic. All Rights Reserved.</p>
                    <div className="payment-icons">
                        <span>We accept:</span>
                        <img src="/mpesa-logo.png" alt="M-Pesa" style={{ height: '24px' }} />
                    </div>
                </div>
            </div>
        </footer>
    );
}
