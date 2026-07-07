const Listing = require('../models/Listing');

// @desc    Get all listings (with filters)
// @route   GET /api/listings
exports.getListings = async (req, res, next) => {
  try {
    const {
      category, location, minPrice, maxPrice, guests,
      checkIn, checkOut, page = 1, limit = 20, search,
    } = req.query;

    const query = {};

    if (category && category !== 'all') query.category = category;
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }
    if (guests) query.maxGuests = { $gte: Number(guests) };
    if (search) query.$text = { $search: search };
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate('host', 'name avatar isSuperhost')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      listings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
exports.getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('host', 'name avatar bio isSuperhost createdAt');
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Create listing
// @route   POST /api/listings
exports.createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create({ ...req.body, host: req.user.id });
    // Mark user as host
    await require('../models/User').findByIdAndUpdate(req.user.id, { isHost: true });
    res.status(201).json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
exports.updateListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.host.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.host.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await listing.deleteOne();
    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get host's listings
// @route   GET /api/listings/host/me
exports.getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ host: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, listings });
  } catch (error) {
    next(error);
  }
};
