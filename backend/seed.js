/**
 * Airbnb Clone — Database Seed Script
 * Run: node seed.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load .env manually (bypass dotenvx)
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      const key = trimmed.substring(0, idx).trim();
      const value = trimmed.substring(idx + 1).trim();
      process.env[key] = value;
    }
  }
});

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}

// ─── Image Banks ─────────────────────────────────────────────────────────────
const IMAGES = {
  Beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
  ],
  Cabins: [
    'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1584464457578-06abab9e29ce?w=800&q=80',
  ],
  'Amazing pools': [
    'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800&q=80',
    'https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=800&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
    'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
  ],
  Countryside: [
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&q=80',
    'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    'https://images.unsplash.com/photo-1530026405186-ed1f139313f3?w=800&q=80',
  ],
  Castles: [
    'https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=800&q=80',
    'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80',
    'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?w=800&q=80',
    'https://images.unsplash.com/photo-1587556275578-5a1bfa8c4e6e?w=800&q=80',
    'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800&q=80',
  ],
  Treehouses: [
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  ],
  Luxe: [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
  ],
  Trending: [
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  ],
  Design: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=800&q=80',
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
    'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80',
  ],
  Tropical: [
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
    'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=800&q=80',
    'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
  ],
};

const getImages = (category) => {
  const bank = IMAGES[category] || IMAGES.Trending;
  return bank.map(url => ({ url, publicId: '' }));
};

// ─── Listings Data ────────────────────────────────────────────────────────────
const listingsData = [
  {
    title: 'Beachfront Villa with Private Pool & Panoramic Ocean Views',
    description: 'Wake up to stunning ocean views in this stunning luxury villa. The villa features a private infinity pool that merges with the ocean horizon, an open-plan living area and direct beach access. Perfect for couples or families seeking an unforgettable coastal escape.',
    category: 'Beach',
    propertyType: 'Entire villa',
    location: { address: 'Calangute Beach Rd', city: 'Goa', state: 'Goa', country: 'India', lat: 15.5524, lng: 73.7612 },
    pricePerNight: 18500,
    maxGuests: 6, bedrooms: 3, beds: 4, bathrooms: 2,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking', 'AC', 'Beach access', 'TV'],
    rating: 4.97, reviewCount: 128, isGuestFavorite: true,
  },
  {
    title: 'Cozy Himalayan Log Cabin with Fireplace',
    description: 'Nestled in a pine forest with breathtaking mountain views, this hand-crafted log cabin is the perfect mountain retreat. Enjoy evenings by the fireplace with a cup of chai while the snow blankets the valley below.',
    category: 'Cabins',
    propertyType: 'Entire cabin',
    location: { address: 'Old Manali', city: 'Manali', state: 'Himachal Pradesh', country: 'India', lat: 32.2432, lng: 77.1892 },
    pricePerNight: 7500,
    maxGuests: 4, bedrooms: 2, beds: 2, bathrooms: 1,
    amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Parking', 'Heating'],
    rating: 4.93, reviewCount: 87, isGuestFavorite: true,
  },
  {
    title: 'Modern Villa with Infinity Pool & City Views',
    description: 'This architectural masterpiece sits atop a hill with a 270-degree view of Udaipur. The infinity pool seems to float above the city. Ultra-modern design meets Rajasthani heritage in every corner of this stunning property.',
    category: 'Amazing pools',
    propertyType: 'Entire villa',
    location: { address: 'Fateh Sagar Lake Rd', city: 'Udaipur', state: 'Rajasthan', country: 'India', lat: 24.5854, lng: 73.6783 },
    pricePerNight: 22000,
    maxGuests: 8, bedrooms: 4, beds: 5, bathrooms: 3,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'AC', 'TV', 'Gym', 'Breakfast'],
    rating: 4.98, reviewCount: 215, isGuestFavorite: true,
  },
  {
    title: 'Heritage Haveli in the Heart of Old City',
    description: 'Experience the royal lifestyle in this 200-year-old restored haveli. The ornate architecture, courtyard fountain, rooftop terrace with lake views, and personalized butler service make this a truly regal experience.',
    category: 'Trending',
    propertyType: 'Entire home',
    location: { address: 'Gangaur Ghat Rd', city: 'Jaipur', state: 'Rajasthan', country: 'India', lat: 26.9124, lng: 75.7873 },
    pricePerNight: 12500,
    maxGuests: 6, bedrooms: 3, beds: 3, bathrooms: 2,
    amenities: ['WiFi', 'AC', 'Kitchen', 'TV', 'Breakfast', 'Parking'],
    rating: 4.95, reviewCount: 167, isGuestFavorite: true,
  },
  {
    title: 'Luxury Treehouse Retreat in the Rainforest',
    description: 'Sleep among the treetops in this stunning elevated treehouse. Fall asleep to the sound of the jungle and wake up to stunning views of the Western Ghats. Completely off-grid yet luxuriously appointed.',
    category: 'Treehouses',
    propertyType: 'Treehouse',
    location: { address: 'Wayanad Wildlife Sanctuary', city: 'Wayanad', state: 'Kerala', country: 'India', lat: 11.6854, lng: 76.1320 },
    pricePerNight: 9800,
    maxGuests: 2, bedrooms: 1, beds: 1, bathrooms: 1,
    amenities: ['WiFi', 'Breakfast', 'AC', 'Hot tub'],
    rating: 4.92, reviewCount: 93, isGuestFavorite: false,
  },
  {
    title: 'Cliffside Overwater Bungalow with Glass Floor',
    description: 'Float above the turquoise waters in this iconic overwater bungalow. The glass floor lets you watch tropical fish swim beneath you. Slide directly from your deck into the crystal-clear lagoon.',
    category: 'Luxe',
    propertyType: 'Entire bungalow',
    location: { address: 'North Malé Atoll', city: 'Malé', state: '', country: 'Maldives', lat: 4.1755, lng: 73.5093 },
    pricePerNight: 45000,
    maxGuests: 2, bedrooms: 1, beds: 1, bathrooms: 1,
    amenities: ['WiFi', 'Pool', 'Beach access', 'Breakfast', 'TV', 'AC'],
    rating: 4.99, reviewCount: 312, isGuestFavorite: true,
  },
  {
    title: 'Designer Loft with Skyline Views',
    description: 'This award-winning designer apartment in Bandra Kurla Complex offers a seamless fusion of art and comfort. Curated art collection, chef-grade kitchen, and panoramic Mumbai skyline views from every room.',
    category: 'Design',
    propertyType: 'Entire apartment',
    location: { address: 'Bandra Kurla Complex', city: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0596, lng: 72.8656 },
    pricePerNight: 15000,
    maxGuests: 4, bedrooms: 2, beds: 2, bathrooms: 2,
    amenities: ['WiFi', 'Kitchen', 'AC', 'TV', 'Gym', 'Parking'],
    rating: 4.90, reviewCount: 76, isGuestFavorite: false,
  },
  {
    title: 'Secluded Tea Estate Bungalow in Munnar',
    description: 'Surrounded by rolling hills of tea plantations as far as the eye can see. This colonial-era planter\'s bungalow has been lovingly restored with modern comforts while preserving its heritage charm.',
    category: 'Countryside',
    propertyType: 'Entire bungalow',
    location: { address: 'Kolukkumalai Estate', city: 'Munnar', state: 'Kerala', country: 'India', lat: 10.0889, lng: 77.0595 },
    pricePerNight: 8500,
    maxGuests: 6, bedrooms: 3, beds: 4, bathrooms: 2,
    amenities: ['WiFi', 'Kitchen', 'Parking', 'Fireplace', 'Breakfast'],
    rating: 4.96, reviewCount: 154, isGuestFavorite: true,
  },
  {
    title: 'Royal Palace Suite with Marble Pool',
    description: 'Live like Maharaja in this converted palace suite. Featuring original 18th-century murals, a private marble pool, elephant polo ground, and 24-hour personal butler service.',
    category: 'Castles',
    propertyType: 'Hotel room',
    location: { address: 'Palace Rd', city: 'Jodhpur', state: 'Rajasthan', country: 'India', lat: 26.2389, lng: 73.0243 },
    pricePerNight: 35000,
    maxGuests: 2, bedrooms: 1, beds: 1, bathrooms: 2,
    amenities: ['WiFi', 'Pool', 'AC', 'TV', 'Breakfast', 'Gym', 'Hot tub'],
    rating: 5.00, reviewCount: 48, isGuestFavorite: true,
  },
  {
    title: 'Backwaters Houseboat with Private Sundeck',
    description: 'Drift through the emerald backwaters of Alleppey on this beautifully appointed kettuvallam houseboat. The scent of coconut oil and the gentle rocking motion make for a uniquely Kerala experience.',
    category: 'Trending',
    propertyType: 'Houseboat',
    location: { address: 'Alleppey Backwaters', city: 'Alleppey', state: 'Kerala', country: 'India', lat: 9.4981, lng: 76.3388 },
    pricePerNight: 11000,
    maxGuests: 4, bedrooms: 2, beds: 2, bathrooms: 2,
    amenities: ['AC', 'Kitchen', 'TV', 'Breakfast', 'Beach access'],
    rating: 4.88, reviewCount: 203, isGuestFavorite: false,
  },
  {
    title: 'Beachside Bamboo Villa, Havelock Island',
    description: 'Fall asleep to the sound of waves in this eco-luxury bamboo villa just steps from the famous Radhanagar Beach. Completely sustainable, yet fully equipped with all modern comforts.',
    category: 'Tropical',
    propertyType: 'Entire villa',
    location: { address: 'Radhanagar Beach', city: 'Havelock Island', state: 'Andaman', country: 'India', lat: 11.9833, lng: 92.9833 },
    pricePerNight: 14000,
    maxGuests: 4, bedrooms: 2, beds: 2, bathrooms: 1,
    amenities: ['WiFi', 'Kitchen', 'Beach access', 'AC', 'Breakfast'],
    rating: 4.94, reviewCount: 89, isGuestFavorite: true,
  },
  {
    title: 'Snow-Dusted Igloo with Northern Lights View',
    description: 'An extraordinary geodesic dome on the banks of a frozen Himalayan lake. The transparent ceiling gives you front-row seats to the Milky Way and occasional northern lights while you cozy up in your king-size thermal bed.',
    category: 'Trending',
    propertyType: 'Dome',
    location: { address: 'Pangong Tso Lake', city: 'Leh', state: 'Ladakh', country: 'India', lat: 33.7432, lng: 78.6543 },
    pricePerNight: 19500,
    maxGuests: 2, bedrooms: 1, beds: 1, bathrooms: 1,
    amenities: ['Heating', 'Breakfast', 'WiFi'],
    rating: 4.99, reviewCount: 37, isGuestFavorite: true,
  },
  {
    title: 'Penthouse with Private Rooftop Hot Tub',
    description: 'Mumbai\'s most exclusive penthouse. Three floors of glass-walled luxury culminating in a rooftop garden with a 10-person hot tub. Helicopter landing possible with prior notice.',
    category: 'Luxe',
    propertyType: 'Entire penthouse',
    location: { address: 'Nariman Point', city: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 18.9256, lng: 72.8242 },
    pricePerNight: 65000,
    maxGuests: 10, bedrooms: 5, beds: 6, bathrooms: 5,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'AC', 'TV', 'Gym', 'Hot tub', 'Parking', 'Elevator'],
    rating: 4.97, reviewCount: 24, isGuestFavorite: false,
  },
  {
    title: 'Riverside Cottage Among Coffee Plantations',
    description: 'A charming stone cottage on the banks of the Cauvery River, surrounded by 200 acres of coffee and spice plantations. Guided plantation walks, birdwatching, and river rafting available.',
    category: 'Countryside',
    propertyType: 'Entire cottage',
    location: { address: 'Madikeri', city: 'Coorg', state: 'Karnataka', country: 'India', lat: 12.4244, lng: 75.7382 },
    pricePerNight: 7200,
    maxGuests: 4, bedrooms: 2, beds: 2, bathrooms: 1,
    amenities: ['WiFi', 'Kitchen', 'Parking', 'Fireplace', 'Breakfast'],
    rating: 4.91, reviewCount: 118, isGuestFavorite: false,
  },
  {
    title: 'Luxury Desert Camp under the Stars',
    description: 'Experience the magic of the Thar Desert in these opulent Swiss tents. Camel safaris at sunset, traditional Rajasthani folk music around a bonfire, and a gourmet dining experience under a blanket of stars.',
    category: 'Trending',
    propertyType: 'Tent',
    location: { address: 'Sam Sand Dunes', city: 'Jaisalmer', state: 'Rajasthan', country: 'India', lat: 26.9157, lng: 70.5853 },
    pricePerNight: 13500,
    maxGuests: 2, bedrooms: 1, beds: 1, bathrooms: 1,
    amenities: ['AC', 'Breakfast', 'WiFi', 'Parking'],
    rating: 4.89, reviewCount: 76, isGuestFavorite: false,
  },
  {
    title: 'Glass Forest Cabin with Plunge Pool',
    description: 'A futuristic glass cabin suspended between ancient oak trees in Coorg. The floor-to-ceiling glass walls blend indoor and outdoor living. Fall asleep stargazing from your king-size bed.',
    category: 'Cabins',
    propertyType: 'Entire cabin',
    location: { address: 'Bhagamandala', city: 'Coorg', state: 'Karnataka', country: 'India', lat: 12.3867, lng: 75.5695 },
    pricePerNight: 16000,
    maxGuests: 2, bedrooms: 1, beds: 1, bathrooms: 1,
    amenities: ['WiFi', 'Pool', 'Breakfast', 'AC', 'Hot tub'],
    rating: 4.98, reviewCount: 63, isGuestFavorite: true,
  },
  {
    title: 'Pink City Rooftop Apartment',
    description: 'A dreamy rooftop apartment in the heart of Jaipur\'s old city. From your private terrace you can see the Hawa Mahal, Nahargarh Fort, and a sea of pink-washed buildings. Perfect for solo travelers and couples.',
    category: 'Design',
    propertyType: 'Entire apartment',
    location: { address: 'Chandpol Bazaar', city: 'Jaipur', state: 'Rajasthan', country: 'India', lat: 26.9260, lng: 75.8235 },
    pricePerNight: 5500,
    maxGuests: 2, bedrooms: 1, beds: 1, bathrooms: 1,
    amenities: ['WiFi', 'AC', 'Kitchen', 'TV'],
    rating: 4.85, reviewCount: 142, isGuestFavorite: false,
  },
  {
    title: 'Private Island Eco-Resort, Lakshadweep',
    description: 'Your own private island for 48 hours. Pristine white sand beaches, crystal-clear lagoons with zero-touch coral reefs, and a team of 4 staff exclusively for you. The most remote luxury in India.',
    category: 'Luxe',
    propertyType: 'Private island',
    location: { address: 'Bangaram Island', city: 'Lakshadweep', state: '', country: 'India', lat: 10.9667, lng: 72.3000 },
    pricePerNight: 78000,
    maxGuests: 4, bedrooms: 2, beds: 2, bathrooms: 2,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'AC', 'Beach access', 'Breakfast', 'Hot tub'],
    rating: 5.00, reviewCount: 19, isGuestFavorite: true,
  },
  {
    title: 'Stilted Mangrove Cottage, Sundarbans',
    description: 'A one-of-a-kind experience — living on stilts over the world\'s largest mangrove forest. Watch Royal Bengal Tigers and Irrawaddy dolphins from your veranda. Expert naturalist guides included.',
    category: 'Countryside',
    propertyType: 'Entire cottage',
    location: { address: 'Gosaba', city: 'Sundarbans', state: 'West Bengal', country: 'India', lat: 22.1667, lng: 88.8000 },
    pricePerNight: 9500,
    maxGuests: 4, bedrooms: 2, beds: 2, bathrooms: 1,
    amenities: ['Breakfast', 'WiFi', 'Beach access'],
    rating: 4.88, reviewCount: 44, isGuestFavorite: false,
  },
  {
    title: 'Balinese-Style Pool Villa, Pondicherry',
    description: 'A slice of Bali in South India. This impeccably designed villa features a lotus-pond courtyard, teak sun-loungers, and an outdoor rain shower. Walk to the French Quarter and Promenade Beach in minutes.',
    category: 'Amazing pools',
    propertyType: 'Entire villa',
    location: { address: 'White Town', city: 'Pondicherry', state: 'Puducherry', country: 'India', lat: 11.9340, lng: 79.8307 },
    pricePerNight: 10800,
    maxGuests: 4, bedrooms: 2, beds: 2, bathrooms: 2,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'AC', 'Breakfast', 'Parking'],
    rating: 4.94, reviewCount: 97, isGuestFavorite: true,
  },
];

// ─── Review Templates ─────────────────────────────────────────────────────────
const reviewComments = [
  'Absolutely breathtaking place! The photos don\'t do it justice. Highly recommended!',
  'Perfect stay. Host was incredibly responsive and the location is unbeatable.',
  'One of the best Airbnb experiences I\'ve ever had. Will definitely return.',
  'Everything was exactly as described. Clean, beautiful, and well-equipped.',
  'A truly special property. Woke up every morning feeling like royalty.',
  'Stunning views, impeccable amenities, and a very thoughtful host.',
  'The perfect romantic getaway. Private, peaceful, and utterly beautiful.',
  'Exceeded our expectations in every way. Book this without hesitation!',
  'An unforgettable experience. The photos are real — if anything, better.',
  'Incredible value for money. We\'ve already planned our next trip back.',
];

// ─── Mongoose Schemas (inline to avoid middleware issues) ─────────────────────
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  avatar: String,
  bio: String,
  isHost: { type: Boolean, default: false },
  isSuperhost: { type: Boolean, default: false },
}, { timestamps: true });

const listingSchema = new mongoose.Schema({
  title: String, description: String, category: String, propertyType: String,
  location: { address: String, city: String, state: String, country: String, lat: Number, lng: Number },
  images: [{ url: String, publicId: String }],
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pricePerNight: Number,
  maxGuests: Number, bedrooms: Number, beds: Number, bathrooms: Number,
  amenities: [String],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isGuestFavorite: { type: Boolean, default: false },
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number, comment: String,
  createdAt: Date,
}, { timestamps: false });

// Use custom collection-mapped models to avoid index conflicts
const User = mongoose.models.SeedUser || mongoose.model('SeedUser', userSchema, 'users');
const Listing = mongoose.models.SeedListing || mongoose.model('SeedListing', listingSchema, 'listings');
const Review = mongoose.models.SeedReview || mongoose.model('SeedReview', reviewSchema, 'reviews');

// ─── Seed Function ────────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      family: 4,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data and drop unique review index if it exists
    await Promise.all([
      User.deleteMany({}),
      Listing.deleteMany({}),
      Review.deleteMany({}),
    ]);
    // Drop the unique compound index to allow multiple reviews in seed
    try {
      await mongoose.connection.collection('reviews').dropIndex('listing_1_author_1');
    } catch (e) { /* Index may not exist, that's fine */ }
    console.log('🗑️  Cleared existing data');

    // Create users with pre-hashed passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const hostUser = await User.create({
      name: 'Alex Thompson',
      email: 'host@airbnb-clone.com',
      password: hashedPassword,
      isHost: true,
      isSuperhost: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
      bio: 'Passionate host with 5+ years of experience.',
    });

    const guestUser = await User.create({
      name: 'Sarah Johnson',
      email: 'guest@airbnb-clone.com',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      bio: 'Avid traveler exploring the world one stay at a time.',
    });

    const guestUser2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@airbnb-clone.com',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
      bio: 'Travel blogger and photography enthusiast.',
    });

    console.log('👥 Created 3 users');

    // Create listings
    const createdListings = [];
    for (const data of listingsData) {
      const listing = await Listing.create({
        ...data,
        host: hostUser._id,
        images: getImages(data.category),
      });
      createdListings.push(listing);
    }
    console.log(`🏠 Created ${createdListings.length} listings`);

    // Create reviews for each listing — 1 review per unique author
    let reviewCount = 0;
    const authors = [guestUser, guestUser2];
    for (const listing of createdListings) {
      const reviewDocs = authors.map((author, i) => ({
        listing: listing._id,
        author: author._id,
        rating: Math.random() > 0.15 ? 5 : 4,
        comment: reviewComments[(createdListings.indexOf(listing) + i) % reviewComments.length],
        createdAt: new Date(Date.now() - Math.random() * 300 * 24 * 60 * 60 * 1000),
      }));
      await Review.insertMany(reviewDocs, { ordered: false }).catch(() => {});
      reviewCount += reviewDocs.length;
    }
    console.log(`⭐ Created ${reviewCount} reviews`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Login credentials:');
    console.log('   Host:  host@airbnb-clone.com  / password123');
    console.log('   Guest: guest@airbnb-clone.com / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
