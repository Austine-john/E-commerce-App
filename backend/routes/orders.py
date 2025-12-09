from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, OrderItem, Cart, CartItem

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@orders_bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    """Create new order from cart"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['phone_number', 'full_name', 'county', 'town', 'address']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Get user's cart
        cart = Cart.query.filter_by(user_id=user_id).first()
        
        if not cart or not cart.items:
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Calculate total
        subtotal = sum(item.product.price * item.quantity for item in cart.items)
        delivery_fee = data.get('delivery_fee', 500.0)
        total_amount = subtotal + delivery_fee
        
        # Create order
        order = Order(
            user_id=user_id,
            total_amount=total_amount,
            delivery_fee=delivery_fee,
            phone_number=data['phone_number'],
            full_name=data['full_name'],
            county=data['county'],
            town=data['town'],
            address=data['address'],
            payment_method=data.get('payment_method', 'mpesa')
        )
        
        db.session.add(order)
        db.session.flush()
        
        # Create order items from cart
        for cart_item in cart.items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price=cart_item.product.price,
                selected_color=cart_item.selected_color,
                selected_size=cart_item.selected_size
            )
            db.session.add(order_item)
        
        # Clear cart
        CartItem.query.filter_by(cart_id=cart.id).delete()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@orders_bp.route('', methods=['GET'])
@jwt_required()
def get_orders():
    """Get user's orders"""
    try:
        user_id = get_jwt_identity()
        
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'orders': [order.to_dict() for order in orders],
            'count': len(orders)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get order by ID"""
    try:
        user_id = get_jwt_identity()
        
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify({'order': order.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
