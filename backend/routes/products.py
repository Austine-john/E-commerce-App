from flask import Blueprint, request, jsonify
from models import db, Product, Category

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

@products_bp.route('', methods=['GET'])
def get_products():
    """Get all products with optional category filter"""
    try:
        category_id = request.args.get('category_id', type=int)
        category_slug = request.args.get('category', type=str)
        
        query = Product.query
        
        if category_id:
            query = query.filter_by(category_id=category_id)
        elif category_slug:
            category = Category.query.filter_by(slug=category_slug).first()
            if category:
                query = query.filter_by(category_id=category.id)
        
        products = query.all()
        
        return jsonify({
            'products': [product.to_dict() for product in products],
            'count': len(products)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get product by ID"""
    try:
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({'product': product.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@products_bp.route('/featured', methods=['GET'])
def get_featured_products():
    """Get featured products"""
    try:
        products = Product.query.filter_by(is_featured=True).all()
        
        return jsonify({
            'products': [product.to_dict() for product in products],
            'count': len(products)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@products_bp.route('/category/<slug>', methods=['GET'])
def get_products_by_category(slug):
    """Get products by category slug"""
    try:
        category = Category.query.filter_by(slug=slug).first()
        
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        
        products = Product.query.filter_by(category_id=category.id).all()
        
        return jsonify({
            'category': category.to_dict(),
            'products': [product.to_dict() for product in products],
            'count': len(products)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
