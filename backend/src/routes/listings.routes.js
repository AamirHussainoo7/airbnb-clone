const express = require('express');
const router = express.Router();
const {
  getListings, getListing, createListing, updateListing, deleteListing, getMyListings,
} = require('../controllers/listings.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', getListings);
router.get('/host/me', protect, getMyListings);
router.get('/:id', getListing);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;
