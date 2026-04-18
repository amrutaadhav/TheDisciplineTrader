const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@disciplinetrader.com';
    const existing = await User.findOne({ email: adminEmail });
    
    if (existing) {
      existing.role = 'admin';
      await existing.save();
      console.log('Admin role updated for:', adminEmail);
    } else {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'AdminPassword123!',
        role: 'admin'
      });
      console.log('New Admin User created');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
