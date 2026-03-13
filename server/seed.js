const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: 'Classic Espresso',
    description: 'A rich, bold shot of our signature espresso blend. Deep, dark roast with notes of dark chocolate and a hint of caramel. The perfect foundation for any coffee lover.',
    price: 3.50,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600',
    rating: 4.8,
    numReviews: 124,
    stock: 200,
    featured: true,
    tags: ['espresso', 'hot', 'strong', 'classic'],
  },
  {
    name: 'Creamy Cappuccino',
    description: 'Velvety steamed milk foam layered over a perfect double shot of espresso. Balanced, smooth, and utterly satisfying. A beloved morning ritual.',
    price: 4.75,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600',
    rating: 4.9,
    numReviews: 210,
    stock: 150,
    featured: true,
    tags: ['cappuccino', 'hot', 'milk', 'foam'],
  },
  {
    name: 'Vanilla Latte',
    description: 'Espresso meets silky steamed milk and house-made vanilla syrup. Smooth, sweet, and aromatic — the perfect everyday indulgence.',
    price: 5.25,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600',
    rating: 4.7,
    numReviews: 178,
    stock: 150,
    featured: true,
    tags: ['latte', 'vanilla', 'hot', 'sweet'],
  },
  {
    name: 'Iced Cold Brew',
    description: 'Steeped for 20 hours in cold water for a naturally sweet, ultra-smooth coffee concentrate. Served over ice for maximum refreshment.',
    price: 5.50,
    category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600',
    rating: 4.9,
    numReviews: 189,
    stock: 100,
    featured: true,
    tags: ['cold brew', 'iced', 'smooth', 'summer'],
  },
  {
    name: 'Mango Iced Tea',
    description: 'Refreshing black tea infused with tropical mango, lightly sweetened and poured over ice. A fruity escape in every sip.',
    price: 4.25,
    category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600',
    rating: 4.6,
    numReviews: 95,
    stock: 120,
    featured: false,
    tags: ['mango', 'iced tea', 'fruit', 'refreshing'],
  },
  {
    name: 'Matcha Latte',
    description: 'Premium ceremonial grade Japanese matcha whisked with steamed oat milk. Earthy, vibrant, and packed with antioxidants.',
    price: 5.75,
    category: 'tea',
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600',
    rating: 4.8,
    numReviews: 143,
    stock: 100,
    featured: true,
    tags: ['matcha', 'green tea', 'latte', 'healthy'],
  },
  {
    name: 'Earl Grey Tea',
    description: 'Bergamot-scented black tea leaves brewed to perfection. Served with a lemon slice and a touch of honey for a classic afternoon experience.',
    price: 3.75,
    category: 'tea',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
    rating: 4.5,
    numReviews: 87,
    stock: 150,
    featured: false,
    tags: ['earl grey', 'black tea', 'classic', 'bergamot'],
  },
  {
    name: 'Grilled Chicken Panini',
    description: 'Herb-marinated grilled chicken with roasted peppers, pesto aioli, and melted provolone on toasted ciabatta. A satisfying lunch staple.',
    price: 9.95,
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600',
    rating: 4.7,
    numReviews: 112,
    stock: 80,
    featured: true,
    tags: ['chicken', 'panini', 'lunch', 'grilled'],
  },
  {
    name: 'Avocado BLT',
    description: 'Crispy applewood-smoked bacon, heirloom tomatoes, fresh avocado, and romaine on sourdough with chipotle mayo. A modern classic.',
    price: 10.50,
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=600',
    rating: 4.8,
    numReviews: 98,
    stock: 60,
    featured: false,
    tags: ['BLT', 'avocado', 'bacon', 'sourdough'],
  },
  {
    name: 'Tiramisu Cake Slice',
    description: 'Layers of espresso-soaked ladyfingers and mascarpone cream dusted with fine cocoa. An Italian classic that pairs perfectly with your afternoon coffee.',
    price: 6.95,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600',
    rating: 4.9,
    numReviews: 201,
    stock: 40,
    featured: true,
    tags: ['tiramisu', 'Italian', 'espresso', 'dessert'],
  },
  {
    name: 'Chocolate Fudge Cake',
    description: 'Three layers of dense, moist chocolate sponge with velvety chocolate fudge frosting. Decorated with chocolate shavings for a decadent finish.',
    price: 7.50,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
    rating: 4.8,
    numReviews: 156,
    stock: 35,
    featured: false,
    tags: ['chocolate', 'cake', 'fudge', 'decadent'],
  },
  {
    name: 'Butter Croissant',
    description: 'Flaky, golden, and impossibly buttery. Our croissants are laminated with 27 layers of French butter and baked fresh every morning.',
    price: 3.95,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600',
    rating: 4.9,
    numReviews: 312,
    stock: 75,
    featured: true,
    tags: ['croissant', 'butter', 'flaky', 'fresh'],
  },
  {
    name: 'Almond Danish',
    description: 'Spiraled puff pastry filled with creamy almond frangipane and topped with toasted almond flakes and vanilla glaze. An elegant morning treat.',
    price: 4.50,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
    rating: 4.7,
    numReviews: 88,
    stock: 60,
    featured: false,
    tags: ['danish', 'almond', 'pastry', 'sweet'],
  },
  {
    name: 'Chocolate Chip Cookies',
    description: 'Extra-thick, chewy cookies loaded with Belgian chocolate chips and a sprinkle of sea salt. Baked to order and served warm.',
    price: 2.75,
    category: 'cookies',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600',
    rating: 4.8,
    numReviews: 267,
    stock: 150,
    featured: true,
    tags: ['cookies', 'chocolate chip', 'chewy', 'classic'],
  },
  {
    name: 'Snickerdoodle Cookies',
    description: 'Soft, pillowy cookies rolled in cinnamon sugar with crisp edges and a chewy center. Warm, nostalgic, and deeply satisfying.',
    price: 2.50,
    category: 'cookies',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600',
    rating: 4.6,
    numReviews: 134,
    stock: 120,
    featured: false,
    tags: ['snickerdoodle', 'cinnamon', 'cookies', 'soft'],
  },
  {
    name: 'Full English Breakfast',
    description: 'Two free-range eggs your way, back bacon, Cumberland sausages, grilled tomato, sautéed mushrooms, baked beans, and thick-cut toast.',
    price: 14.95,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600',
    rating: 4.8,
    numReviews: 89,
    stock: 50,
    featured: true,
    tags: ['breakfast', 'english', 'eggs', 'bacon'],
  },
  {
    name: 'Avocado Toast',
    description: 'Smashed avocado on toasted sourdough topped with poached eggs, cherry tomatoes, microgreens, and a drizzle of chili oil.',
    price: 11.95,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600',
    rating: 4.7,
    numReviews: 176,
    stock: 60,
    featured: true,
    tags: ['avocado', 'toast', 'poached egg', 'healthy'],
  },
  {
    name: 'Strawberry Smoothie',
    description: 'Blended fresh strawberries, banana, Greek yogurt, honey, and a splash of almond milk. Thick, creamy, and naturally sweet.',
    price: 6.50,
    category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600',
    rating: 4.6,
    numReviews: 102,
    stock: 80,
    featured: false,
    tags: ['smoothie', 'strawberry', 'healthy', 'fruit'],
  },
  {
    name: 'Caramel Macchiato',
    description: 'Espresso poured over vanilla-flavored steamed milk, finished with a beautiful crosshatch of caramel drizzle. Sweet, indulgent, and Instagram-worthy.',
    price: 5.95,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=600',
    rating: 4.9,
    numReviews: 243,
    stock: 100,
    featured: true,
    tags: ['caramel', 'macchiato', 'espresso', 'sweet'],
  },
  {
    name: 'Blueberry Muffin',
    description: 'Bakery-style muffin bursting with fresh blueberries, with a crunchy streusel topping. Moist, tender, and baked fresh every morning.',
    price: 3.75,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600',
    rating: 4.7,
    numReviews: 145,
    stock: 90,
    featured: false,
    tags: ['muffin', 'blueberry', 'bakery', 'morning'],
  },
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@brewhaven.com',
  password: 'admin123',
  role: 'admin',
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({ email: adminUser.email });
    console.log('🗑️  Cleared existing data');

    // Seed products
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    // Create admin user
    await User.create(adminUser);
    console.log('✅ Admin user created: admin@brewhaven.com / admin123');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedDB();
