const multer = require('multer');
const sharp = require('sharp');
const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeature');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImages = upload.fields([
  { name: 'productCover', maxCount: 1 },
  { name: 'images', maxCount: 6 },
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();
  console.log(req.files);
  //1) Cover image
  // if (req.files.productCover) {
  //   req.body.productCover = `product-${req.params.id}-${Date.now()}-cover.jpeg`;
  //   await sharp(req.files.productCover[0].buffer)
  //     .resize(2000, 1333)
  //     .toFormat('jpeg')
  //     .jpeg({ quality: 90 })
  //     .toFile(`public/img/products/${req.body.productCover}`);
  // }

  //2)images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/products/${filename}`);
        req.body.images.push(filename);
      })
    );
  }

  next();
});

//create Product
exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

//get Product
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No blog found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

//Get all Products
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

//update produc
exports.updateProduct = catchAsync(async (req, res, next) => {
  let data = req.body;
  if (req.body.data) data = req.body.data;
  const product = await Product.findOneAndUpdate({ _id: req.params.id }, data, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  await product.save();
  const updatedProduct = await Product.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedProduct,
    },
  });
});
