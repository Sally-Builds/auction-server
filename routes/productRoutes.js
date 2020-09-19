const express = require('express');
// const authController = require('../controller/authController');
const productController = require('../controller/productController');

const router = express.Router();

router
  .route('/')
  .post(productController.createProduct)
  .get(productController.getAllProducts);

router.route('/:id').get(productController.getProduct).patch(
  // authController.protect,
  productController.uploadProductImages,
  productController.resizeProductImages,
  productController.updateProduct
);

module.exports = router;
