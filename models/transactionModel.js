const mongoose = require('mongoose');
const Fund = require('./fundModel');

const transactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You must enter a transaction type'],
      enum: ['deposit', 'withdrawal'],
    },
    amount: {
      type: Number,
      required: [true, 'You must enter an amount'],
    },
    time: {
      type: Date,
      default: new Date(),
    },
    fund: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'You must enter an account you want to fund'],
      ref: 'Fund',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

transactionSchema.statics.calcBalance = async function (fundId, type, amount) {
  const fund = await Fund.findById(fundId);
  let { balance } = fund;
  balance *= 1;
  if (type === 'withdrawal') {
    balance -= amount * 1;
  }
  if (type === 'deposit') {
    balance += amount * 1;
  }
  console.log('entered the statics');
  await Fund.findByIdAndUpdate(fundId, { balance });
};

transactionSchema.post('save', function () {
  this.constructor.calcBalance(this.fund, this.name, this.amount);
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
