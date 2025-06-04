const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { addExpense, getExpenses } = require('../controllers/expenseController');


router.post('/groups/:groupId/expenses', auth, addExpense);


router.get('/groups/:groupId/expenses', auth, getExpenses);

module.exports = router;
