# AfroChic E-Commerce Application

A modern full-stack e-commerce application built with React and Flask, featuring M-Pesa payment integration.

## Project Structure

```
E-commerce-App/
├── backend/                 # Flask backend API
│   ├── routes/             # API route blueprints
│   ├── services/           # Business logic (M-Pesa service)
│   ├── models.py           # Database models
│   ├── app.py              # Flask application
│   ├── config.py           # Configuration
│   ├── seed.py             # Database seeding
│   └── requirements.txt    # Python dependencies
│
└── Frontend/               # React frontend
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── context/        # React Context providers
    │   ├── services/       # API service layer
    │   ├── config/         # Configuration
    │   ├── Pages/          # Page components
    │   ├── App.jsx         # Main app component
    │   └── index.css       # Global styles
    └── package.json        # Node dependencies
```

## Features

### Backend (Flask)
- ✅ RESTful API with Flask
- ✅ SQLAlchemy ORM with SQLite
- ✅ JWT authentication
- ✅ User registration and login
- ✅ Product catalog management
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ M-Pesa Daraja API integration (placeholder)
- ✅ CORS enabled for React frontend

### Frontend (React)
- ✅ Modern React with Hooks
- ✅ React Router for navigation
- ✅ Context API for state management
- ✅ Axios for API calls
- ✅ Responsive design
- ✅ Product browsing and filtering
- ✅ Shopping cart
- ✅ User authentication
- ✅ Checkout flow
- ✅ M-Pesa payment integration

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Seed the database:
```bash
python seed.py
```

5. Run the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Default Credentials

- **Email**: test@afrochic.com
- **Password**: password123

## API Endpoints

See `backend/README.md` for complete API documentation.

## Technologies Used

### Backend
- Flask 3.0
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS
- SQLite

### Frontend
- React 19
- React Router DOM
- Axios
- React Icons
- Vite

## M-Pesa Integration

The M-Pesa integration is currently a **placeholder implementation** for development and testing purposes. To use real M-Pesa payments:

1. Register for Safaricom Daraja API access
2. Obtain your credentials (Consumer Key, Consumer Secret, Passkey)
3. Update the `.env` file in the backend directory
4. Replace placeholder functions in `backend/services/mpesa.py` with actual API calls

## Development Notes

- The backend uses SQLite for development. For production, consider PostgreSQL or MySQL.
- JWT tokens are stored in localStorage on the frontend.
- Cart data is persisted in the database for logged-in users.
- The design follows the AfroChic brand with orange accent colors (#FF8C00).

## License

This project is for educational purposes.
