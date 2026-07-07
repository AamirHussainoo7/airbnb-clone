const express = require('express');
const router = express.Router();
const { createReview, getListingReviews, deleteReview } = require('../controllers/reviews.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createReview);
router.get('/listing/:id', getListingReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
