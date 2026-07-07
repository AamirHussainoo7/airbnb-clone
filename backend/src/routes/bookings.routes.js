const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, cancelBooking, getListingBookings,
} = require('../controllers/bookings.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.get('/listing/:id', protect, getListingBookings);

module.exports = router;
