const Wishlist = require('../models/Wishlist');

// @desc    Get user's wishlists
// @route   GET /api/wishlists
exports.getWishlists = async (req, res, next) => {
  try {
    const wishlists = await Wishlist.find({ user: req.user.id })
      .populate('listings', 'title images pricePerNight location rating reviewCount isGuestFavorite category');
    res.json({ success: true, wishlists });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle listing in wishlist
// @route   POST /api/wishlists/:listingId
exports.toggleWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, listings: [req.params.listingId] });
      return res.json({ success: true, saved: true, wishlist });
    }
    const idx = wishlist.listings.findIndex(id => id.toString() === req.params.listingId);
    if (idx === -1) {
      wishlist.listings.push(req.params.listingId);
    } else {
      wishlist.listings.splice(idx, 1);
    }
    await wishlist.save();
    res.json({ success: true, saved: idx === -1, wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if listing is wishlisted
// @route   GET /api/wishlists/check/:listingId
exports.checkWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    const saved = wishlist ? wishlist.listings.some(id => id.toString() === req.params.listingId) : false;
    res.json({ success: true, saved });
  } catch (error) {
    next(error);
  }
};
