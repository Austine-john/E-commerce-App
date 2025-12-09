import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';
import './Navbar.css';

export const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState('home');
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItemCount } = useCart();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => setActiveMenu('home')}>
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">AfroChic</span>
          </Link>

          {/* Navigation Links */}
          <ul className="nav-menu">
            <li className={activeMenu === 'home' ? 'active' : ''}>
              <Link to="/" onClick={() => setActiveMenu('home')}>Home</Link>
            </li>
            <li className={activeMenu === 'makeup' ? 'active' : ''}>
              <Link to="/makeup" onClick={() => setActiveMenu('makeup')}>Makeup</Link>
            </li>
            <li className={activeMenu === 'accessories' ? 'active' : ''}>
              <Link to="/mobile-accessories" onClick={() => setActiveMenu('accessories')}>
                Mobile Accessories
              </Link>
            </li>
            <li className={activeMenu === 'clothes' ? 'active' : ''}>
              <Link to="/shoes-clothes" onClick={() => setActiveMenu('clothes')}>
                Shoes & Clothes
              </Link>
            </li>
          </ul>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {/* Search Icon */}
            <button className="icon-btn" aria-label="Search">
              <FiSearch size={20} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="cart-btn">
              <FiShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="user-menu">
                <button className="icon-btn">
                  <FiUser size={20} />
                </button>
                <div className="user-dropdown">
                  <p className="user-name">{user?.full_name}</p>
                  <Link to="/orders">My Orders</Link>
                  <button onClick={logout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-login">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
