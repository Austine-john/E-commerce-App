# AfroChic E-Commerce Backend

Flask backend API for the AfroChic e-commerce application with M-Pesa payment integration.

## Features

- RESTful API with Flask
- SQLAlchemy ORM with SQLite database
- JWT authentication
- M-Pesa Daraja API integration (placeholder)
- CORS enabled for React frontend

## Setup

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file (copy from `.env.example`):
```bash
copy .env.example .env
```

6. Seed the database:
```bash
python seed.py
```

### Running the Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/<id>` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/<slug>` - Get products by category

### Categories
- `GET /api/categories` - Get all categories

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/<item_id>` - Update cart item
- `DELETE /api/cart/remove/<item_id>` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders (Protected)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/<id>` - Get order by ID

### Payments (Protected)
- `POST /api/payments/mpesa/initiate` - Initiate M-Pesa STK push
- `POST /api/payments/mpesa/callback` - M-Pesa callback handler
- `GET /api/payments/<order_id>/status` - Check payment status
- `POST /api/payments/mpesa/simulate-success/<order_id>` - Simulate successful payment (testing only)

## Sample User

- Email: `test@afrochic.com`
- Password: `password123`

## M-Pesa Integration

The M-Pesa integration is currently a **placeholder implementation**. To use real M-Pesa payments:

1. Register for Safaricom Daraja API access
2. Get your credentials (Consumer Key, Consumer Secret, Passkey)
3. Update the `.env` file with your credentials
4. Replace placeholder functions in `services/mpesa.py` with actual API calls

## Database Models

- **User**: User accounts and authentication
- **Category**: Product categories
- **Product**: Product catalog
- **Cart**: Shopping carts
- **CartItem**: Items in shopping carts
- **Order**: Customer orders
- **OrderItem**: Items in orders
- **Payment**: Payment transactions
