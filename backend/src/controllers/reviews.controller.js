const Review = require('../models/Review');

// @desc    Create review
// @route   POST /api/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { listingId, rating, comment, categories } = req.body;
    const existing = await Review.findOne({ listing: listingId, author: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this listing' });
    }
    const review = await Review.create({
      listing: listingId,
      author: req.user.id,
      rating,
      comment,
      categories,
    });
    await review.populate('author', 'name avatar createdAt');
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a listing
// @route   GET /api/reviews/listing/:id
exports.getListingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ listing: req.params.id })
      .populate('author', 'name avatar createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};
