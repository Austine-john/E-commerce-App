from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication and orders"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    carts = db.relationship('Cart', backref='user', lazy=True, cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary (excluding password)"""
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'phone_number': self.phone_number,
            'created_at': self.created_at.isoformat()
        }


class Category(db.Model):
    """Product category model"""
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    
    # Relationships
    products = db.relationship('Product', backref='category', lazy=True)
    
    def to_dict(self):
        """Convert category to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'image_url': self.image_url
        }


class Product(db.Model):
    """Product model"""
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    old_price = db.Column(db.Float)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    additional_images = db.Column(db.Text)  # JSON string of image URLs
    stock = db.Column(db.Integer, default=0)
    color_options = db.Column(db.Text)  # JSON string of available colors
    size_options = db.Column(db.Text)  # JSON string of available sizes
    is_featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    cart_items = db.relationship('CartItem', backref='product', lazy=True)
    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    
    def to_dict(self):
        """Convert product to dictionary"""
        import json
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'old_price': self.old_price,
            'category_id': self.category_id,
            'category': self.category.to_dict() if self.category else None,
            'image_url': self.image_url,
            'additional_images': json.loads(self.additional_images) if self.additional_images else [],
            'stock': self.stock,
            'color_options': json.loads(self.color_options) if self.color_options else [],
            'size_options': json.loads(self.size_options) if self.size_options else [],
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat()
        }


class Cart(db.Model):
    """Shopping cart model"""
    __tablename__ = 'carts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    items = db.relationship('CartItem', backref='cart', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert cart to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'items': [item.to_dict() for item in self.items],
            'total': sum(item.product.price * item.quantity for item in self.items),
            'created_at': self.created_at.isoformat()
        }


class CartItem(db.Model):
    """Cart item model"""
    __tablename__ = 'cart_items'
    
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)
    selected_color = db.Column(db.String(50))
    selected_size = db.Column(db.String(20))
    
    def to_dict(self):
        """Convert cart item to dictionary"""
        return {
            'id': self.id,
            'cart_id': self.cart_id,
            'product': self.product.to_dict() if self.product else None,
            'quantity': self.quantity,
            'selected_color': self.selected_color,
            'selected_size': self.selected_size,
            'subtotal': self.product.price * self.quantity if self.product else 0
        }


class Order(db.Model):
    """Order model"""
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    delivery_fee = db.Column(db.Float, default=500.0)
    status = db.Column(db.String(20), default='pending')  # pending, processing, shipped, delivered, cancelled
    
    # Delivery information
    phone_number = db.Column(db.String(20), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    county = db.Column(db.String(50), nullable=False)
    town = db.Column(db.String(50), nullable=False)
    address = db.Column(db.Text, nullable=False)
    
    # Payment information
    payment_method = db.Column(db.String(20), default='mpesa')
    payment_status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    payments = db.relationship('Payment', backref='order', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert order to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_amount': self.total_amount,
            'delivery_fee': self.delivery_fee,
            'status': self.status,
            'phone_number': self.phone_number,
            'full_name': self.full_name,
            'county': self.county,
            'town': self.town,
            'address': self.address,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat()
        }


class OrderItem(db.Model):
    """Order item model"""
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)  # Price at time of order
    selected_color = db.Column(db.String(50))
    selected_size = db.Column(db.String(20))
    
    def to_dict(self):
        """Convert order item to dictionary"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product': self.product.to_dict() if self.product else None,
            'quantity': self.quantity,
            'price': self.price,
            'selected_color': self.selected_color,
            'selected_size': self.selected_size,
            'subtotal': self.price * self.quantity
        }


class Payment(db.Model):
    """Payment transaction model"""
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    mpesa_receipt_number = db.Column(db.String(50))
    transaction_id = db.Column(db.String(50), unique=True)
    phone_number = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, success, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert payment to dictionary"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'mpesa_receipt_number': self.mpesa_receipt_number,
            'transaction_id': self.transaction_id,
            'phone_number': self.phone_number,
            'amount': self.amount,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
