"""
Database initialization and migration script for production
Run this after deploying to Render to set up the database
"""
from app import create_app
from models import db

def init_db():
    """Initialize database tables"""
    app = create_app()
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Database tables created successfully!")

if __name__ == '__main__':
    init_db()
