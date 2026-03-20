require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function makeAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = 'v18542763@gmail.com';
  
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: 'Admin User',
      email: email,
      passwordHash: 'admin123',
      role: 'admin',
    });
    console.log(`Created new Admin user: ${email} with password: admin123`);
  } else {
    user.role = 'admin';
    await user.save();
    console.log(`Successfully upgraded existing user ${email} to Admin!`);
  }
  console.log(`You can now login at http://localhost:5173/login and visit the admin panel!`);
  process.exit();
}

makeAdmin();
