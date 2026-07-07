const express = require('express');
const router = express.Router();
const { getWishlists, toggleWishlist, checkWishlist } = require('../controllers/wishlists.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getWishlists);
router.get('/check/:listingId', protect, checkWishlist);
router.post('/:listingId', protect, toggleWishlist);

module.exports = router;
