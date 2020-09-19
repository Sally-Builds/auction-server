const express = require('express');
const authController = require('../controller/authController');
const transactionController = require('../controller/transactionController');

const router = express.Router();

router.use(authController.protect);
router.route('/').post(transactionController.createTransaction);

module.exports = router;
