from flask import Blueprint, jsonify
from models import db, Category

categories_bp = Blueprint('categories', __name__, url_prefix='/api/categories')

@categories_bp.route('', methods=['GET'])
def get_categories():
    """Get all categories"""
    try:
        categories = Category.query.all()
        
        return jsonify({
            'categories': [category.to_dict() for category in categories],
            'count': len(categories)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
