const mongoose = require('mongoose');
const Settlement = require('../models/settlement');
const Balance = require('../models/balance');

async function recordSettlement({ groupId, payerId, payeeId, amount }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
   
    const settlement = new Settlement({
      groupId,
      payerId,
      payeeId,
      amount,
      date: new Date(),
    });

    await settlement.save({ session });

    await Balance.findOneAndUpdate(
      { groupId, from: payeeId, to: payerId },
      { $inc: { amount: -amount } },
      { upsert: true, new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return settlement;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}


module.exports = {
  recordSettlement,
};
