import base64
import requests
from datetime import datetime
from flask import current_app
import random
import string

class MpesaService:
    """M-Pesa Daraja API service (Placeholder Implementation)"""
    
    def __init__(self):
        self.consumer_key = None
        self.consumer_secret = None
        self.business_shortcode = None
        self.passkey = None
        self.callback_url = None
        self.environment = None
        self.access_token = None
    
    def initialize(self, app):
        """Initialize with app configuration"""
        self.consumer_key = app.config['MPESA_CONSUMER_KEY']
        self.consumer_secret = app.config['MPESA_CONSUMER_SECRET']
        self.business_shortcode = app.config['MPESA_BUSINESS_SHORTCODE']
        self.passkey = app.config['MPESA_PASSKEY']
        self.callback_url = app.config['MPESA_CALLBACK_URL']
        self.environment = app.config['MPESA_ENVIRONMENT']
    
    def get_access_token(self):
        """
        Generate M-Pesa access token (PLACEHOLDER)
        In production, this would make a real API call to Safaricom
        """
        # PLACEHOLDER: Simulate token generation
        self.access_token = f"placeholder_token_{datetime.now().timestamp()}"
        return self.access_token
    
    def generate_password(self):
        """Generate password for STK push"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        data_to_encode = f"{self.business_shortcode}{self.passkey}{timestamp}"
        encoded = base64.b64encode(data_to_encode.encode()).decode('utf-8')
        return encoded, timestamp
    
    def initiate_stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """
        Initiate STK push (PLACEHOLDER)
        In production, this would make a real API call to Safaricom
        
        Args:
            phone_number: Customer phone number (254XXXXXXXXX format)
            amount: Amount to charge
            account_reference: Order ID or reference
            transaction_desc: Description of transaction
        
        Returns:
            dict: Response with transaction details
        """
        # PLACEHOLDER: Simulate STK push
        # In production, you would:
        # 1. Get access token
        # 2. Generate password and timestamp
        # 3. Make POST request to https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest
        
        # Ensure phone number is in correct format
        if phone_number.startswith('0'):
            phone_number = '254' + phone_number[1:]
        elif phone_number.startswith('+'):
            phone_number = phone_number[1:]
        
        # Generate placeholder transaction ID
        transaction_id = 'TXN' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        
        # Simulate successful STK push initiation
        response = {
            'success': True,
            'message': 'STK push initiated successfully (PLACEHOLDER)',
            'merchant_request_id': f'MR{random.randint(10000, 99999)}',
            'checkout_request_id': f'ws_CO_{datetime.now().strftime("%Y%m%d%H%M%S")}_{random.randint(1000, 9999)}',
            'response_code': '0',
            'response_description': 'Success. Request accepted for processing',
            'customer_message': 'Success. Request accepted for processing',
            'transaction_id': transaction_id,
            'phone_number': phone_number,
            'amount': amount
        }
        
        return response
    
    def query_stk_status(self, checkout_request_id):
        """
        Query STK push status (PLACEHOLDER)
        In production, this would make a real API call to Safaricom
        """
        # PLACEHOLDER: Simulate status query
        # In production, you would make POST request to:
        # https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query
        
        # Simulate successful payment (80% success rate for testing)
        is_success = random.random() < 0.8
        
        if is_success:
            response = {
                'success': True,
                'result_code': '0',
                'result_desc': 'The service request is processed successfully.',
                'status': 'success'
            }
        else:
            response = {
                'success': False,
                'result_code': '1032',
                'result_desc': 'Request cancelled by user',
                'status': 'failed'
            }
        
        return response
    
    def process_callback(self, callback_data):
        """
        Process M-Pesa callback (PLACEHOLDER)
        In production, this would validate and process real callback data
        
        Args:
            callback_data: Callback data from M-Pesa
        
        Returns:
            dict: Processed payment information
        """
        # PLACEHOLDER: Simulate callback processing
        # In production, you would:
        # 1. Validate callback data
        # 2. Extract payment details
        # 3. Update order status
        
        # Simulate extracting payment details
        result_code = callback_data.get('Body', {}).get('stkCallback', {}).get('ResultCode', 0)
        
        if result_code == 0:
            # Successful payment
            callback_metadata = callback_data.get('Body', {}).get('stkCallback', {}).get('CallbackMetadata', {}).get('Item', [])
            
            payment_info = {
                'success': True,
                'result_code': result_code,
                'result_desc': 'Payment successful',
                'amount': 0,
                'mpesa_receipt_number': f'MPESA{random.randint(100000, 999999)}',
                'transaction_date': datetime.now().isoformat(),
                'phone_number': '254712345678'
            }
            
            # Extract metadata if available
            for item in callback_metadata:
                name = item.get('Name')
                value = item.get('Value')
                
                if name == 'Amount':
                    payment_info['amount'] = value
                elif name == 'MpesaReceiptNumber':
                    payment_info['mpesa_receipt_number'] = value
                elif name == 'TransactionDate':
                    payment_info['transaction_date'] = str(value)
                elif name == 'PhoneNumber':
                    payment_info['phone_number'] = str(value)
        else:
            # Failed payment
            payment_info = {
                'success': False,
                'result_code': result_code,
                'result_desc': 'Payment failed or cancelled'
            }
        
        return payment_info

# Create singleton instance
mpesa_service = MpesaService()
