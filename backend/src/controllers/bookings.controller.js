const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// @desc    Create booking
// @route   POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    // Check for conflicting bookings
    const conflict = await Booking.findOne({
      listing: listingId,
      status: { $ne: 'cancelled' },
      $or: [
        { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
        { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } },
      ],
    });

    if (conflict) {
      return res.status(400).json({ success: false, message: 'Dates are not available' });
    }

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const pricePerNight = listing.pricePerNight;
    const cleaningFee = Math.round(pricePerNight * 0.15);
    const serviceFee = Math.round(pricePerNight * nights * 0.14);
    const totalPrice = pricePerNight * nights + cleaningFee + serviceFee;

    const booking = await Booking.create({
      listing: listingId,
      guest: req.user.id,
      checkIn,
      checkOut,
      guests,
      nights,
      pricePerNight,
      cleaningFee,
      serviceFee,
      totalPrice,
    });

    await booking.populate('listing', 'title images location');
    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guest: req.user.id })
      .populate('listing', 'title images location pricePerNight')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.guest.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for a listing (host)
// @route   GET /api/bookings/listing/:id
exports.getListingBookings = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.host.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const bookings = await Booking.find({ listing: req.params.id, status: { $ne: 'cancelled' } })
      .populate('guest', 'name avatar')
      .sort({ checkIn: 1 });
    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};
