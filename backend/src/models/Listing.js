const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Trending', 'Beach', 'Cabins', 'Amazing pools', 'Countryside',
        'Castles', 'OMG!', 'Design', 'Arctic', 'Tiny homes', 'Tropical',
        'Lakefront', 'Ski-in/out', 'Farms', 'Caves', 'Islands', 'Domes',
        'Treehouses', 'Houseboats', 'Ryokans', 'Top cities', 'Windmills',
        'Containers', 'Chef\'s kitchens', 'Luxe',
      ],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
      },
    ],
    location: {
      address: { type: String, default: '' },
      city: { type: String, required: [true, 'City is required'] },
      state: { type: String, default: '' },
      country: { type: String, required: [true, 'Country is required'] },
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [1, 'Price must be at least 1'],
    },
    maxGuests: {
      type: Number,
      required: [true, 'Max guests is required'],
      min: [1, 'Must accommodate at least 1 guest'],
    },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    beds: { type: Number, default: 1 },
    amenities: [{ type: String }],
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isGuestFavorite: { type: Boolean, default: false },
    propertyType: {
      type: String,
      enum: ['Entire place', 'Private room', 'Hotel room', 'Shared room'],
      default: 'Entire place',
    },
    cancellationPolicy: {
      type: String,
      enum: ['Flexible', 'Moderate', 'Strict'],
      default: 'Moderate',
    },
  },
  { timestamps: true }
);

// Text index for search
listingSchema.index({ title: 'text', description: 'text', 'location.city': 'text', 'location.country': 'text' });

module.exports = mongoose.model('Listing', listingSchema);
