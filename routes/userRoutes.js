// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require('../middlewares/auth');

// Get all groups the user is part of
router.get('/:userId/groups', auth, groupController.getUserGroups);

module.exports = router;
