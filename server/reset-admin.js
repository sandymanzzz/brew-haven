const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Manually hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Find and update directly without triggering pre-save hook
    const result = await mongoose.connection.collection('users').findOneAndUpdate(
      { email: 'admin@brewhaven.com' },
      {
        $set: {
          password: hashedPassword,
          role: 'admin'
        }
      },
      { returnDocument: 'after' }
    );

    if (result) {
      console.log('✅ Admin password reset successfully!');
      console.log('📧 Email: admin@brewhaven.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role:', result.role);
    } else {
      console.log('⚠️  User not found - creating new admin...');

      const newAdmin = {
        name: 'Admin User',
        email: 'admin@brewhaven.com',
        password: hashedPassword,
        role: 'admin',
        phone: '',
        address: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await mongoose.connection.collection('users').insertOne(newAdmin);
      console.log('✅ New admin created!');
      console.log('📧 Email: admin@brewhaven.com');
      console.log('🔑 Password: admin123');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

resetAdmin();