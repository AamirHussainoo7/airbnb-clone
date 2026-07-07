const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile } = require('../controllers/users.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/:id', getUserProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
