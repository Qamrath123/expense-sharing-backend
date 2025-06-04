// models/settlement.js
const mongoose = require('mongoose');

const SettlementSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  payerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Settlement = mongoose.models.Settlement || mongoose.model('Settlement', SettlementSchema);
module.exports = Settlement;
