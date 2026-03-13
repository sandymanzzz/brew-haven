const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  {
    name: 'Classic Espresso',
    description: 'A rich bold shot of our signature espresso blend with notes of dark chocolate and caramel.',
    price: 3.50, category: 'coffee',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600',
    rating: 4.8, numReviews: 124, stock: 200, featured: true,
    tags: ['espresso', 'hot', 'strong'],
  },
  {
    name: 'Creamy Cappuccino',
    description: 'Velvety steamed milk foam over a perfect double shot of espresso.',
    price: 4.75, category: 'coffee',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600',
    rating: 4.9, numReviews: 210, stock: 150, featured: true,
    tags: ['cappuccino', 'hot', 'milk'],
  },
  {
    name: 'Vanilla Latte',
    description: 'Espresso with silky steamed milk and house-made vanilla syrup.',
    price: 5.25, category: 'coffee',
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600',
    rating: 4.7, numReviews: 178, stock: 150, featured: true,
    tags: ['latte', 'vanilla', 'hot'],
  },
  {
    name: 'Caramel Macchiato',
    description: 'Espresso over vanilla steamed milk finished with caramel drizzle.',
    price: 5.95, category: 'coffee',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=600',
    rating: 4.9, numReviews: 243, stock: 100, featured: true,
    tags: ['caramel', 'macchiato', 'sweet'],
  },
  {
    name: 'Iced Cold Brew',
    description: 'Steeped 20 hours for a naturally sweet ultra-smooth coffee concentrate.',
    price: 5.50, category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600',
    rating: 4.9, numReviews: 189, stock: 100, featured: true,
    tags: ['cold brew', 'iced', 'smooth'],
  },
  {
    name: 'Mango Iced Tea',
    description: 'Black tea infused with tropical mango lightly sweetened over ice.',
    price: 4.25, category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600',
    rating: 4.6, numReviews: 95, stock: 120, featured: false,
    tags: ['mango', 'iced tea', 'refreshing'],
  },
  {
    name: 'Strawberry Smoothie',
    description: 'Fresh strawberries banana Greek yogurt honey and almond milk.',
    price: 6.50, category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600',
    rating: 4.6, numReviews: 102, stock: 80, featured: false,
    tags: ['smoothie', 'strawberry', 'healthy'],
  },
  {
    name: 'Matcha Latte',
    description: 'Ceremonial grade Japanese matcha whisked with steamed oat milk.',
    price: 5.75, category: 'tea',
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600',
    rating: 4.8, numReviews: 143, stock: 100, featured: true,
    tags: ['matcha', 'green tea', 'healthy'],
  },
  {
    name: 'Earl Grey Tea',
    description: 'Bergamot-scented black tea brewed to perfection with lemon and honey.',
    price: 3.75, category: 'tea',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
    rating: 4.5, numReviews: 87, stock: 150, featured: false,
    tags: ['earl grey', 'black tea', 'classic'],
  },
  {
    name: 'Grilled Chicken Panini',
    description: 'Herb-marinated chicken with roasted peppers pesto and provolone on ciabatta.',
    price: 9.95, category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600',
    rating: 4.7, numReviews: 112, stock: 80, featured: true,
    tags: ['chicken', 'panini', 'lunch'],
  },
  {
    name: 'Avocado BLT',
    description: 'Bacon heirloom tomatoes avocado and romaine on sourdough with chipotle mayo.',
    price: 10.50, category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=600',
    rating: 4.8, numReviews: 98, stock: 60, featured: false,
    tags: ['BLT', 'avocado', 'bacon'],
  },
  {
    name: 'Tiramisu Cake Slice',
    description: 'Espresso-soaked ladyfingers and mascarpone cream dusted with cocoa.',
    price: 6.95, category: 'cakes',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600',
    rating: 4.9, numReviews: 201, stock: 40, featured: true,
    tags: ['tiramisu', 'Italian', 'dessert'],
  },
  {
    name: 'Chocolate Fudge Cake',
    description: 'Three layers of moist chocolate sponge with velvety fudge frosting.',
    price: 7.50, category: 'cakes',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
    rating: 4.8, numReviews: 156, stock: 35, featured: false,
    tags: ['chocolate', 'cake', 'decadent'],
  },
  {
    name: 'Butter Croissant',
    description: 'Flaky golden croissant laminated with 27 layers of French butter.',
    price: 3.95, category: 'pastries',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600',
    rating: 4.9, numReviews: 312, stock: 75, featured: true,
    tags: ['croissant', 'butter', 'flaky'],
  },
  {
    name: 'Almond Danish',
    description: 'Puff pastry with almond frangipane toasted almonds and vanilla glaze.',
    price: 4.50, category: 'pastries',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
    rating: 4.7, numReviews: 88, stock: 60, featured: false,
    tags: ['danish', 'almond', 'pastry'],
  },
  {
    name: 'Blueberry Muffin',
    description: 'Bakery-style muffin bursting with blueberries and crunchy streusel topping.',
    price: 3.75, category: 'pastries',
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600',
    rating: 4.7, numReviews: 145, stock: 90, featured: false,
    tags: ['muffin', 'blueberry', 'morning'],
  },
  {
    name: 'Chocolate Chip Cookies',
    description: 'Extra-thick chewy cookies loaded with Belgian chocolate chips and sea salt.',
    price: 2.75, category: 'cookies',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600',
    rating: 4.8, numReviews: 267, stock: 150, featured: true,
    tags: ['cookies', 'chocolate chip', 'chewy'],
  },
  {
    name: 'Snickerdoodle Cookies',
    description: 'Soft pillowy cookies rolled in cinnamon sugar with crisp edges.',
    price: 2.50, category: 'cookies',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600',
    rating: 4.6, numReviews: 134, stock: 120, featured: false,
    tags: ['snickerdoodle', 'cinnamon', 'soft'],
  },
  {
    name: 'Full English Breakfast',
    description: 'Eggs bacon sausages grilled tomato mushrooms beans and toast.',
    price: 14.95, category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600',
    rating: 4.8, numReviews: 89, stock: 50, featured: true,
    tags: ['breakfast', 'english', 'eggs'],
  },
  {
    name: 'Avocado Toast',
    description: 'Smashed avocado on sourdough with poached eggs cherry tomatoes and chili oil.',
    price: 11.95, category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600',
    rating: 4.7, numReviews: 176, stock: 60, featured: true,
    tags: ['avocado', 'toast', 'healthy'],
  },
];

const fix = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Step 1 - Upgrade your account to admin
    const yourAccount = await User.findOneAndUpdate(
      { email: 'admin@brewhaven.com' },
      { role: 'admin' },
      { new: true }
    );

    if (yourAccount) {
      console.log(`✅ ${yourAccount.name} upgraded to admin!`);
    } else {
      console.log('⚠️  admin@brewhaven.com not found - creating fresh admin...');
      // Delete any existing user with that email first
      await User.deleteOne({ email: 'admin@brewhaven.com' });
      await User.create({
        name: 'Admin User',
        email: 'admin@brewhaven.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Fresh admin created: admin@brewhaven.com / admin123');
    }

    // Step 2 - Seed products if empty
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(products);
      console.log(`✅ Seeded ${products.length} products`);
    } else {
      console.log(`ℹ️  ${count} products already exist — skipping seed`);
    }

    console.log('\n🎉 All fixed!');
    console.log('📧 Admin email: admin@brewhaven.com');
    console.log('🔑 Admin password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

fix();
