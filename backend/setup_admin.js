const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'dhirajadhav707@gmail.com';
    const existing = await User.findOne({ email: adminEmail });
    
    if (existing) {
      existing.role = 'admin';
      // If user wants specific password, we should update it if it's the admin setup script's job
      // but usually we just want to promote the existing user to admin.
      // However, the user specifically gave a password too.
      // Note: User.js has a pre-save hook for hashing.
      existing.password = '@Dhiraj@890'; 
      await existing.save();
      console.log('Admin role and password updated for:', adminEmail);
    } else {
      await User.create({
        name: 'The Discipline Trader Admin',
        email: adminEmail,
        password: '@Dhiraj@890',
        role: 'admin'
      });
      console.log('New Admin User created with requested credentials');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
