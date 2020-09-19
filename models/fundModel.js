const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      unique: true,
      required: [true, 'This Account must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

fundSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'fund',
});

const Fund = mongoose.model('Fund', fundSchema);

module.exports = Fund;
