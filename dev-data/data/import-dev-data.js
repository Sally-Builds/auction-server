const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const Chat = require('../../models/chatModel');
const Transaction = require('../../models/transactionModel');
const Fund = require('../../models/fundModel');

dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(`mongodb://localhost:27017/project2`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('db connected'));

//READ JSON FILE
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

//import data ingo db
const importData = async () => {
  try {
    await Product.create(products);
    await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    console.log('data loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//delete all data from collectoion
const deleteData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Chat.deleteMany();
    await Fund.deleteMany();
    await Transaction.deleteMany();
    console.log('Data deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
