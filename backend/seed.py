import json
from app import create_app
from models import db, User, Category, Product

def seed_database():
    """Seed database with initial data"""
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()
        
        # Create categories
        print("Creating categories...")
        makeup_category = Category(
            name='Makeup',
            slug='makeup',
            description='Premium makeup products, proudly Kenyan',
            image_url='https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'
        )
        accessories_category = Category(
            name='Mobile Accessories',
            slug='mobile-accessories',
            description='Quality mobile accessories for your devices',
            image_url='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
        )
        clothes_category = Category(
            name='Shoes & Clothes',
            slug='shoes-clothes',
            description='Stylish shoes and clothing for every occasion',
            image_url='https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800'
        )
        
        db.session.add(makeup_category)
        db.session.add(accessories_category)
        db.session.add(clothes_category)
        db.session.commit()
        
        # Create products with realistic data and images
        print("Creating products...")
        products_data = [
            # Makeup Products
            {
                'name': 'Velvet Matte Lipstick',
                'description': 'Long-lasting matte lipstick with rich, vibrant color. Infused with vitamin E for smooth application and all-day comfort.',
                'price': 1200,
                'old_price': 1500,
                'category_id': makeup_category.id,
                'image_url': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500',
                'additional_images': json.dumps([
                    'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=500',
                    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500'
                ]),
                'stock': 45,
                'color_options': json.dumps(['Ruby Red', 'Nude Pink', 'Berry Wine', 'Coral Sunset']),
                'size_options': json.dumps([]),
                'is_featured': True
            },
            {
                'name': 'Radiant Glow Foundation',
                'description': 'Lightweight, buildable coverage foundation with SPF 30. Perfect for achieving a natural, dewy finish that lasts all day.',
                'price': 2800,
                'old_price': 3200,
                'category_id': makeup_category.id,
                'image_url': 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=500',
                'additional_images': json.dumps([
                    'https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=500'
                ]),
                'stock': 30,
                'color_options': json.dumps(['Ivory', 'Beige', 'Caramel', 'Espresso', 'Deep Brown']),
                'size_options': json.dumps([]),
                'is_featured': True
            },
            {
                'name': 'Shimmer Eyeshadow Palette',
                'description': '12 highly pigmented shades ranging from soft neutrals to bold metallics. Perfect for creating day-to-night looks.',
                'price': 2200,
                'old_price': 2800,
                'category_id': makeup_category.id,
                'image_url': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500',
                'additional_images': json.dumps([
                    'https://images.unsplash.com/photo-1583241800698-c318dd366dfa?w=500'
                ]),
                'stock': 25,
                'color_options': json.dumps(['Warm Tones', 'Cool Tones', 'Smokey']),
                'size_options': json.dumps([]),
                'is_featured': False
            },
            {
                'name': 'Precision Eyeliner Pen',
                'description': 'Waterproof liquid eyeliner with ultra-fine tip for precise application. Smudge-proof formula lasts up to 24 hours.',
                'price': 950,
                'old_price': None,
                'category_id': makeup_category.id,
                'image_url': 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=500',
                'additional_images': json.dumps([]),
                'stock': 60,
                'color_options': json.dumps(['Jet Black', 'Deep Brown', 'Navy Blue']),
                'size_options': json.dumps([]),
                'is_featured': False
            },

            # Mobile Accessories
            {
                'name': 'Premium Wireless Earbuds',
                'description': 'True wireless earbuds with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. IPX7 water resistant.',
                'price': 4500,
                'old_price': 5500,
                'category_id': accessories_category.id,
                'image_url': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
                'additional_images': json.dumps([
                    'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500',
                    'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=500'
                ]),
                'stock': 35,
                'color_options': json.dumps(['Matte Black', 'Pearl White', 'Rose Gold']),
                'size_options': json.dumps([]),
                'is_featured': True
            },
            {
                'name': 'Leather Phone Case',
                'description': 'Genuine leather phone case with card slots and magnetic closure. Slim design with premium craftsmanship. Fits iPhone 13/14/15.',
                'price': 1800,
                'old_price': 2200,
                'category_id': accessories_category.id,
                'image_url': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
                'additional_images': json.dumps([
                    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500'
                ]),
                'stock': 50,
                'color_options': json.dumps(['Black', 'Brown', 'Tan', 'Navy']),
                'size_options': json.dumps([]),
                'is_featured': False
            },
            {
                'name': 'Fast Wireless Charger',
                'description': '15W fast wireless charging pad with LED indicator. Compatible with all Qi-enabled devices. Includes USB-C cable.',
                'price': 2200,
                'old_price': None,
                'category_id': accessories_category.id,
                'image_url': 'https://images.unsplash.com/photo-1591290619762-c588f7e8e86f?w=500',
                'additional_images': json.dumps([]),
                'stock': 40,
                'color_options': json.dumps(['Black', 'White']),
                'size_options': json.dumps([]),
                'is_featured': False
            },
            {
                'name': 'Portable Power Bank 20000mAh',
                'description': 'High-capacity power bank with dual USB ports and USB-C. Fast charging technology, LED display shows remaining battery.',
                'price': 3200,
                'old_price': 3800,
                'category_id': accessories_category.id,
                'image_url': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
                'additional_images': json.dumps([]),
                'stock': 28,
                'color_options': json.dumps(['Black', 'Silver', 'Blue']),
                'size_options': json.dumps([]),
                'is_featured': True
            },

            # Shoes & Clothes
            {
                'name': 'Classic Leather Loafers',
                'description': 'Handcrafted genuine leather loafers with cushioned insole. Perfect for both casual and formal occasions. Premium quality construction.',
                'price': 6500,
                'old_price': 7800,
                'category_id': clothes_category.id,
                'image_url': 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500',
                'additional_images': json.dumps([
                    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500',
                    'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=500'
                ]),
                'stock': 20,
                'color_options': json.dumps(['Black', 'Brown', 'Tan']),
                'size_options': json.dumps(['38', '39', '40', '41', '42', '43', '44']),
                'is_featured': True
            },
            {
                'name': 'Suede Block Heel Sandals',
                'description': 'Elegant suede sandals with comfortable 3-inch block heel. Ankle strap for secure fit. Perfect for any occasion.',
                'price': 4800,
                'old_price': 5500,
                'category_id': clothes_category.id,
                'image_url': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500',
                'additional_images': json.dumps([
                    'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=500'
                ]),
                'stock': 18,
                'color_options': json.dumps(['Nude', 'Black', 'Burgundy']),
                'size_options': json.dumps(['36', '37', '38', '39', '40', '41']),
                'is_featured': True
            },
            {
                'name': 'Canvas Sneakers',
                'description': 'Comfortable low-top canvas sneakers with rubber sole. Classic design that goes with everything. Breathable and durable.',
                'price': 3200,
                'old_price': None,
                'category_id': clothes_category.id,
                'image_url': 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500',
                'additional_images': json.dumps([
                    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500'
                ]),
                'stock': 35,
                'color_options': json.dumps(['White', 'Black', 'Navy', 'Red']),
                'size_options': json.dumps(['38', '39', '40', '41', '42', '43', '44', '45']),
                'is_featured': False
            },
            {
                'name': 'Cotton T-Shirt Pack (3-Pack)',
                'description': 'Premium 100% cotton crew neck t-shirts. Soft, breathable fabric. Perfect fit with reinforced stitching. Pack of 3.',
                'price': 2400,
                'old_price': 3000,
                'category_id': clothes_category.id,
                'image_url': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
                'additional_images': json.dumps([]),
                'stock': 45,
                'color_options': json.dumps(['Black Pack', 'White Pack', 'Mixed Colors']),
                'size_options': json.dumps(['S', 'M', 'L', 'XL', 'XXL']),
                'is_featured': False
            },
            {
                'name': 'Denim Jacket',
                'description': 'Classic denim jacket with button closure and chest pockets. Versatile piece for layering. Premium denim fabric.',
                'price': 5200,
                'old_price': 6000,
                'category_id': clothes_category.id,
                'image_url': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
                'additional_images': json.dumps([
                    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500'
                ]),
                'stock': 22,
                'color_options': json.dumps(['Light Blue', 'Dark Blue', 'Black']),
                'size_options': json.dumps(['S', 'M', 'L', 'XL']),
                'is_featured': False
            },
            {
                'name': 'Floral Summer Dress',
                'description': 'Lightweight floral print dress with adjustable straps. Perfect for warm weather. Breathable fabric with flattering fit.',
                'price': 3800,
                'old_price': None,
                'category_id': clothes_category.id,
                'image_url': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
                'additional_images': json.dumps([
                    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500'
                ]),
                'stock': 30,
                'color_options': json.dumps(['Blue Floral', 'Pink Floral', 'Yellow Floral']),
                'size_options': json.dumps(['XS', 'S', 'M', 'L', 'XL']),
                'is_featured': True
            }
        ]
        
        for product_data in products_data:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()
        
        # Create sample user
        print("Creating sample user...")
        user = User(
            email='test@afrochic.com',
            full_name='Test User',
            phone_number='254712345678'
        )
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        
        print("\nDatabase seeded successfully!")
        print(f"Created 3 categories")
        print(f"Created {Product.query.count()} products")
        print(f"Sample user: test@afrochic.com / password123")

if __name__ == '__main__':
    seed_database()
