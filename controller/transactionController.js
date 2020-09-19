const Transaction = require('../models/transactionModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const checkIf = (name, amount, fund, next) => {
  if (name === 'withdrawal' && amount > fund) {
    return 'error';
    // return next(new AppError('Insufficient funds', 400));
  }
};

exports.createTransaction = catchAsync(async (req, res, next) => {
  if (!req.body.fund) req.body.fund = req.user.fund[0].id;
  const fund = req.user.fund[0].balance;
  if (checkIf(req.body.name, req.body.amount, fund, next) === 'error') {
    console.log('err');
    return next(new AppError('Insufficient funds', 400));
  }
  const transaction = await Transaction.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      transaction,
    },
  });
});
