const Expense = require('../models/expense');
const User = require('../models/user');
const Balance = require('../models/balance');

exports.addExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { description, amount, participants } = req.body;

    // Find users by emails in participants array
    const users = await User.find({ email: { $in: participants } });
    if (users.length !== participants.length) {
      return res.status(400).json({ message: 'Some participants not found' });
    }

    const participantIds = users.map(user => user._id);

    const share = parseFloat((amount / participantIds.length).toFixed(2));
    const sharePerUser = {};
    participantIds.forEach(id => {
      sharePerUser[id.toString()] = share;
    });

    
    const expense = new Expense({
      groupId,
      description,
      amount,
      paidBy: req.user.id,
      participants: participantIds,
      sharePerUser,
      createdBy: req.user.id
    });

    await expense.save();

   
    for (const participantId of participantIds) {
      if (participantId.toString() === req.user.id) continue;

      const shareAmount = sharePerUser[participantId.toString()];

      await Balance.findOneAndUpdate(
        {
          groupId,
          from: participantId,
          to: req.user.id
        },
        { $inc: { amount: shareAmount } },
        { upsert: true, new: true }
      );
    }

    res.status(201).json(expense);
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ groupId })
      .populate('paidBy', 'name email')
      .populate('participants', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
