const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    categories: {
      cleanliness: { type: Number, min: 1, max: 5, default: 5 },
      accuracy: { type: Number, min: 1, max: 5, default: 5 },
      checkIn: { type: Number, min: 1, max: 5, default: 5 },
      communication: { type: Number, min: 1, max: 5, default: 5 },
      location: { type: Number, min: 1, max: 5, default: 5 },
      value: { type: Number, min: 1, max: 5, default: 5 },
    },
  },
  { timestamps: true }
);

// One review per user per listing
reviewSchema.index({ listing: 1, author: 1 }, { unique: true });

// Update listing rating after review save
reviewSchema.post('save', async function () {
  const Review = this.constructor;
  const Listing = require('./Listing');
  const stats = await Review.aggregate([
    { $match: { listing: this.listing } },
    {
      $group: {
        _id: '$listing',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);
  if (stats.length > 0) {
    await Listing.findByIdAndUpdate(this.listing, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
