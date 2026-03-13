const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');

const reset = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected');

  const user = await User.findOne({ email: 'admin@brewhaven.com' });
  if (!user) { console.log('❌ User not found'); process.exit(1); }

  // This triggers the bcrypt hash in the User model
  user.password = 'admin123';
  await user.save();

  console.log('✅ Password reset to: admin123');
  console.log('📧 Email: admin@brewhaven.com');
  process.exit(0);
};

reset();
