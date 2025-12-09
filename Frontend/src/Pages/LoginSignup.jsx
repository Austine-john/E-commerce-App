import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import './LoginSignup.css';

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone_number: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await register({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          phone_number: formData.phone_number
        });
      }

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setError(`${provider} login coming soon!`);
  };

  return (
    <div className="auth-page-split">
      {/* Left Side - Hero Image */}
      <div className="auth-hero">
        <div className="auth-hero-overlay">
          <div className="auth-hero-content">
            <h1>AfroChic</h1>
            <p>Discover the best in Kenyan style</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          {/* Logo */}
          <div className="auth-brand">
            <h2>🛍️ AfroChic</h2>
          </div>

          {/* Title */}
          <div className="auth-title">
            <h1>{isLogin ? 'Welcome Back' : 'Create Your Account'}</h1>
            <p>{isLogin ? 'Log in to continue your shopping journey.' : 'Start shopping for the best in Kenyan style.'}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form-main">
            {error && <div className="auth-error">{error}</div>}

            {!isLogin && (
              <div className="form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-field">
              <label>Email {!isLogin && 'Address'}</label>
              <input
                type="email"
                name="email"
                placeholder={isLogin ? 'Enter your email or username' : 'Enter your email address'}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="254712345678"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-field">
              <div className="form-field-header">
                <label>Password</label>
                {isLogin && (
                  <a href="#" className="forgot-password">Forgot Password?</a>
                )}
              </div>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="form-field">
                <label>Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
            </button>

            <div className="auth-divider">
              <span>{isLogin ? 'OR' : 'Or continue with'}</span>
            </div>

            <div className="social-login-buttons">
              <button
                type="button"
                className="social-btn google-btn"
                onClick={() => handleSocialLogin('Google')}
              >
                <FaGoogle size={18} />
                <span>{isLogin ? 'Log in with Google' : 'Sign up with Google'}</span>
              </button>
              {isLogin && (
                <button
                  type="button"
                  className="social-btn facebook-btn"
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  <FaFacebook size={18} />
                  <span>Log in with Facebook</span>
                </button>
              )}
            </div>

            {!isLogin && (
              <p className="terms-text">
                By signing up, you agree to our{' '}
                <a href="#">Terms of Service</a> & <a href="#">Privacy Policy</a>.
              </p>
            )}

            <p className="auth-switch">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    full_name: '',
                    phone_number: ''
                  });
                }}
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
