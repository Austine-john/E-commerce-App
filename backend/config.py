import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///ecommerce.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours
    
    # M-Pesa Configuration (Placeholder)
    MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY', 'placeholder-key')
    MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET', 'placeholder-secret')
    MPESA_BUSINESS_SHORTCODE = os.getenv('MPESA_BUSINESS_SHORTCODE', '174379')
    MPESA_PASSKEY = os.getenv('MPESA_PASSKEY', 'placeholder-passkey')
    MPESA_CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL', 'http://localhost:5000/api/payments/mpesa/callback')
    MPESA_ENVIRONMENT = os.getenv('MPESA_ENVIRONMENT', 'sandbox')
    
    # CORS
    #CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
    # CORS
CORS_ORIGINS = os.getenv(
    'CORS_ORIGINS',
    'http://localhost:5173,http://localhost:3000,https://e-commerce-app-bf1o.vercel.app'
).split(',')


    