const express = require('express');
const authController = require('../controller/authController');
const fundController = require('../controller/fundController');

const router = express.Router();

router.use(authController.protect);
router.route('/').post(fundController.createFund).get(fundController.getFunds);

// router.route('/:id').get(fundController.getFunds);

module.exports = router;
