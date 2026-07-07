const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security & Logging Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/listings', require('./src/routes/listings.routes'));
app.use('/api/bookings', require('./src/routes/bookings.routes'));
app.use('/api/reviews', require('./src/routes/reviews.routes'));
app.use('/api/users', require('./src/routes/users.routes'));
app.use('/api/wishlists', require('./src/routes/wishlists.routes'));
app.use('/api/upload', require('./src/routes/upload.routes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Airbnb Clone API is running' });
});

// Error Handler
app.use(require('./src/middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
