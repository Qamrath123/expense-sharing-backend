const Settlement = require('../models/settlement');
const { recordSettlement } = require('../service/settlementService'); // service encapsulates transaction logic
const mongoose = require('mongoose');

exports.addSettlement = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { payerId, payeeId, amount } = req.body;

    if (!payerId || !payeeId || amount <= 0) {
      return res.status(400).json({ message: 'payerId, payeeId, and positive amount are required.' });
    }

    const groupObjectId = new mongoose.Types.ObjectId(groupId);
    const payerObjectId = new mongoose.Types.ObjectId(payerId);
    const payeeObjectId = new mongoose.Types.ObjectId(payeeId);

    console.log('Saving settlement:', {
      groupObjectId,
      payerObjectId,
      payeeObjectId,
      amount,
    });

    await recordSettlement({
      groupId: groupObjectId,
      payerId: payerObjectId,
      payeeId: payeeObjectId,
      amount,
    });

    res.json({ message: 'Settlement recorded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getUserSettlements = async (req, res) => {
  try {
    const { userId } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(userId); // ✅ Use new

    const settlements = await Settlement.find({
      $or: [{ payerId: userObjectId }, { payeeId: userObjectId }],
    })
      .populate('payerId', 'name email')
      .populate('payeeId', 'name email')
      .sort({ date: -1 });

    res.status(200).json(settlements);
  } catch (err) {
    console.error('Error fetching settlements:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
