from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, Payment
from services.mpesa import mpesa_service

payments_bp = Blueprint('payments', __name__, url_prefix='/api/payments')

@payments_bp.route('/mpesa/initiate', methods=['POST'])
@jwt_required()
def initiate_mpesa_payment():
    """Initiate M-Pesa STK push (PLACEHOLDER)"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if 'order_id' not in data:
            return jsonify({'error': 'order_id is required'}), 400
        
        # Get order
        order = Order.query.filter_by(id=data['order_id'], user_id=user_id).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        if order.payment_status == 'completed':
            return jsonify({'error': 'Order already paid'}), 400
        
        # Get phone number (use order phone or provided phone)
        phone_number = data.get('phone_number', order.phone_number)
        
        # Initiate STK push (PLACEHOLDER)
        response = mpesa_service.initiate_stk_push(
            phone_number=phone_number,
            amount=order.total_amount,
            account_reference=f'ORDER{order.id}',
            transaction_desc=f'Payment for Order #{order.id}'
        )
        
        if response['success']:
            # Create payment record
            payment = Payment(
                order_id=order.id,
                transaction_id=response['transaction_id'],
                phone_number=phone_number,
                amount=order.total_amount,
                status='pending'
            )
            
            db.session.add(payment)
            db.session.commit()
            
            return jsonify({
                'message': 'STK push initiated successfully (PLACEHOLDER)',
                'checkout_request_id': response['checkout_request_id'],
                'merchant_request_id': response['merchant_request_id'],
                'transaction_id': response['transaction_id'],
                'customer_message': response['customer_message']
            }), 200
        else:
            return jsonify({'error': 'Failed to initiate payment'}), 500
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@payments_bp.route('/mpesa/callback', methods=['POST'])
def mpesa_callback():
    """M-Pesa payment callback (PLACEHOLDER)"""
    try:
        callback_data = request.get_json()
        
        # Process callback (PLACEHOLDER)
        payment_info = mpesa_service.process_callback(callback_data)
        
        if payment_info['success']:
            # Find payment by transaction ID or order ID
            # This is simplified for placeholder
            # In production, you'd extract the actual transaction ID from callback
            
            # Update payment status
            # payment = Payment.query.filter_by(transaction_id=transaction_id).first()
            # if payment:
            #     payment.status = 'success'
            #     payment.mpesa_receipt_number = payment_info['mpesa_receipt_number']
            #     
            #     # Update order payment status
            #     order = Order.query.get(payment.order_id)
            #     order.payment_status = 'completed'
            #     order.status = 'processing'
            #     
            #     db.session.commit()
            
            return jsonify({'ResultCode': 0, 'ResultDesc': 'Success'}), 200
        else:
            return jsonify({'ResultCode': 1, 'ResultDesc': 'Failed'}), 200
        
    except Exception as e:
        return jsonify({'ResultCode': 1, 'ResultDesc': str(e)}), 200


@payments_bp.route('/<int:order_id>/status', methods=['GET'])
@jwt_required()
def check_payment_status(order_id):
    """Check payment status for an order"""
    try:
        user_id = get_jwt_identity()
        
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Get latest payment for order
        payment = Payment.query.filter_by(order_id=order_id).order_by(Payment.created_at.desc()).first()
        
        return jsonify({
            'order_id': order.id,
            'payment_status': order.payment_status,
            'order_status': order.status,
            'payment': payment.to_dict() if payment else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@payments_bp.route('/mpesa/simulate-success/<int:order_id>', methods=['POST'])
@jwt_required()
def simulate_payment_success(order_id):
    """Simulate successful payment (PLACEHOLDER - for testing only)"""
    try:
        user_id = get_jwt_identity()
        
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Update order payment status
        order.payment_status = 'completed'
        order.status = 'processing'
        
        # Update payment record if exists
        payment = Payment.query.filter_by(order_id=order_id).order_by(Payment.created_at.desc()).first()
        if payment:
            payment.status = 'success'
            payment.mpesa_receipt_number = f'MPESA{order_id}TEST'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Payment simulated successfully',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
