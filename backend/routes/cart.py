from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Cart, CartItem, Product

cart_bp = Blueprint('cart', __name__, url_prefix='/api/cart')

@cart_bp.route('', methods=['GET'])
@jwt_required()
def get_cart():
    """Get user's cart"""
    try:
        user_id = get_jwt_identity()
        
        # Get or create cart for user
        cart = Cart.query.filter_by(user_id=user_id).first()
        
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.commit()
        
        return jsonify({'cart': cart.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@cart_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    """Add item to cart"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if 'product_id' not in data:
            return jsonify({'error': 'product_id is required'}), 400
        
        # Check if product exists
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Get or create cart
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.flush()
        
        # Check if item already in cart
        cart_item = CartItem.query.filter_by(
            cart_id=cart.id,
            product_id=data['product_id'],
            selected_color=data.get('selected_color'),
            selected_size=data.get('selected_size')
        ).first()
        
        if cart_item:
            # Update quantity
            cart_item.quantity += data.get('quantity', 1)
        else:
            # Add new item
            cart_item = CartItem(
                cart_id=cart.id,
                product_id=data['product_id'],
                quantity=data.get('quantity', 1),
                selected_color=data.get('selected_color'),
                selected_size=data.get('selected_size')
            )
            db.session.add(cart_item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Item added to cart',
            'cart': cart.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@cart_bp.route('/update/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    """Update cart item quantity"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Find cart item
        cart_item = CartItem.query.join(Cart).filter(
            CartItem.id == item_id,
            Cart.user_id == user_id
        ).first()
        
        if not cart_item:
            return jsonify({'error': 'Cart item not found'}), 404
        
        # Update quantity
        if 'quantity' in data:
            if data['quantity'] <= 0:
                db.session.delete(cart_item)
            else:
                cart_item.quantity = data['quantity']
        
        db.session.commit()
        
        cart = Cart.query.filter_by(user_id=user_id).first()
        
        return jsonify({
            'message': 'Cart updated',
            'cart': cart.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@cart_bp.route('/remove/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    """Remove item from cart"""
    try:
        user_id = get_jwt_identity()
        
        # Find cart item
        cart_item = CartItem.query.join(Cart).filter(
            CartItem.id == item_id,
            Cart.user_id == user_id
        ).first()
        
        if not cart_item:
            return jsonify({'error': 'Cart item not found'}), 404
        
        db.session.delete(cart_item)
        db.session.commit()
        
        cart = Cart.query.filter_by(user_id=user_id).first()
        
        return jsonify({
            'message': 'Item removed from cart',
            'cart': cart.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@cart_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    """Clear entire cart"""
    try:
        user_id = get_jwt_identity()
        
        cart = Cart.query.filter_by(user_id=user_id).first()
        
        if cart:
            CartItem.query.filter_by(cart_id=cart.id).delete()
            db.session.commit()
        
        return jsonify({'message': 'Cart cleared'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
