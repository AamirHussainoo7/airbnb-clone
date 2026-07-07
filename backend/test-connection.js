/**
 * Quick MongoDB connection test
 * Run: node test-connection.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB connection...');
console.log('📡 URI:', process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^@]+)@/, ':***@') : 'NOT SET');

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4,
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  console.log('🏠 Database:', mongoose.connection.name);
  console.log('🖥️  Host:', mongoose.connection.host);
  process.exit(0);
})
.catch((err) => {
  console.error('❌ Connection FAILED:', err.message);
  console.error('\n💡 Fix: Go to MongoDB Atlas → Network Access → Add 0.0.0.0/0');
  process.exit(1);
});
