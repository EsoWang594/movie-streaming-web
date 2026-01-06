require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});

async function updateUserRole() {
  try {
    const username = process.argv[2];
    const newRole = process.argv[3];
    
    if (!username || !newRole) {
      console.log('Cách sử dụng:');
      console.log('  node scripts/updateUserRole.js <username> <role>');
      console.log('\nVí dụ:');
      console.log('  node scripts/updateUserRole.js admin admin');
      console.log('  node scripts/updateUserRole.js user123 user');
      process.exit(1);
    }
    
    if (!['admin', 'user'].includes(newRole)) {
      console.error('Role phải là "admin" hoặc "user"');
      process.exit(1);
    }
    
    const user = await User.findOne({ username });
    
    if (!user) {
      console.error(`Không tìm thấy user với username: ${username}`);
      process.exit(1);
    }
    
    user.role = newRole;
    await user.save();
    
    console.log(`\n✅ Đã cập nhật role của "${username}" thành "${newRole}"`);
    
  } catch (err) {
    console.error("Lỗi:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

updateUserRole();
