const Fund = require('../models/fundModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createFund = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  const fund = await Fund.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      fund,
    },
  });
});

exports.getFunds = catchAsync(async (req, res, next) => {
  // if (!req.params.id) req.params.id = req.user.id;
  const fund = await Fund.find({ user: req.user.id }).populate('transactions');

  if (!fund) next(AppError('No fund found with that id', 400));

  res.status(200).json({
    status: 'success',
    data: {
      fund,
    },
  });
});
