const mongoose = require('mongoose');
const slugify = require('slugify');
const AppError = require('../utils/appError');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You must provide the product name'],
      unique: true,
    },
    description: {
      type: String,
      // required: [true, 'You must give the description of your product'],
    },
    productCover: {
      type: String,
      // required: [true, 'Must have an image cover'],
    },
    images: [String],
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    ongoing: {
      type: Boolean,
      default: false,
    },
    slug: String,
    startingBid: {
      type: String,
      min: 1,
    },
    minBidInc: Number,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre('save', function (next) {
  if (this.startingBid <= 100) {
    this.minBidInc = 10;
  } else if (this.startingBid > 100 && this.startingBid <= 249) {
    this.minBidInc = 20;
  } else if (this.startingBid >= 300 && this.startingBid <= 499) {
    this.minBidInc = 30;
  } else if (this.startingBid >= 500 && this.startingBid <= 999) {
    this.minBidInc = 50;
  } else if (this.startingBid >= 1000) {
    this.minBidInc = 100;
  }
  next();
});

productSchema.pre('save', function (next) {
  if (this.startTime > this.endTime) {
    return next(
      new AppError('Start Date must be less than the ending time', 404)
    );
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
