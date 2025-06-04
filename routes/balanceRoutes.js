const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const balancesController = require('../controllers/balanceController');
const settlementsController = require('../controllers/settlementController');

router.get('/groups/:groupId/balances', auth, balancesController.getGroupBalances);
router.post('/groups/:groupId/settlements', auth, settlementsController.addSettlement);
router.get('/users/:userId/settlements', auth, settlementsController.getUserSettlements);

module.exports = router;
