from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from services.mpesa import mpesa_service

# Import blueprints
from routes.auth import auth_bp
from routes.products import products_bp
from routes.categories import categories_bp
from routes.cart import cart_bp
from routes.orders import orders_bp
from routes.payments import payments_bp

def create_app(config_class=Config):
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    CORS(
        app,
        origins=app.config.get('CORS_ORIGINS', "*"),  # list of allowed origins or '*' for all
        supports_credentials=True,                    # allows cookies, auth headers
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )
    JWTManager(app)
    
    # Initialize M-Pesa service
    with app.app_context():
        mpesa_service.initialize(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(payments_bp)
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'AfroChic API is running'}), 200
    
    # Seed database endpoint (for initial setup without shell access)
    @app.route('/api/seed', methods=['POST'])
    def seed_database():
        """Seed the database with initial data. Remove this endpoint after first use for security."""
        try:
            from models import Category, Product
            
            # Check if data already exists
            if Category.query.first() is not None:
                return jsonify({'message': 'Database already seeded'}), 200
            
            # Create categories
            categories_data = [
                {'name': 'Makeup', 'slug': 'makeup', 'description': 'Beauty and cosmetics products'},
                {'name': 'Mobile Accessories', 'slug': 'mobile-accessories', 'description': 'Phone cases, chargers, and accessories'},
                {'name': 'Shoes & Clothes', 'slug': 'shoes-clothes', 'description': 'Fashion and apparel'}
            ]
            
            categories = {}
            for cat_data in categories_data:
                category = Category(**cat_data)
                db.session.add(category)
                db.session.flush()
                categories[cat_data['slug']] = category.id
            
            # Create sample products
            products_data = [
                {
                    'name': 'Luxury Lipstick Set',
                    'description': 'Premium matte lipstick collection',
                    'price': 29.99,
                    'category_id': categories['makeup'],
                    'image_url': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa',
                    'stock': 50
                },
                {
                    'name': 'Wireless Phone Charger',
                    'description': 'Fast charging wireless pad',
                    'price': 24.99,
                    'category_id': categories['mobile-accessories'],
                    'image_url': 'https://images.unsplash.com/photo-1591290619762-d2c9e0a4e7e3',
                    'stock': 100
                },
                {
                    'name': 'Designer Sneakers',
                    'description': 'Comfortable running shoes',
                    'price': 89.99,
                    'category_id': categories['shoes-clothes'],
                    'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
                    'stock': 30
                }
            ]
            
            for prod_data in products_data:
                product = Product(**prod_data)
                db.session.add(product)
            
            db.session.commit()
            
            return jsonify({
                'message': 'Database seeded successfully',
                'categories': len(categories_data),
                'products': len(products_data)
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    # Create database tables
    with app.app_context():
        db.create_all()

    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
