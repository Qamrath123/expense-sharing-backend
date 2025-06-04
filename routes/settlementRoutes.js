const express = require('express');
const router = express.Router();
const settlementController = require('../controllers/settlementController');

router.get('/users/:userId/settlements', settlementController.getUserSettlements);

module.exports = router;
