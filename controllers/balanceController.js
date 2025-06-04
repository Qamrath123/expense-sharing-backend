const Balance = require('../models/balance');

exports.getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Find all balances for the group with amount > 0
    const balances = await Balance.find({ groupId, amount: { $gt: 0 } })
      .populate('from', 'name email')
      .populate('to', 'name email');

    res.json(balances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
