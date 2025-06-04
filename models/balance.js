const mongoose = require('mongoose');

const BalanceSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // the person who owes money
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // the person who is owed money
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Balance', BalanceSchema);
