const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const fundRouter = require('./routes/fundRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//middleware
//1) Global middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

//body parser, reading data from body into req.body
app.use(express.json());
app.use(cookieParser());

//testing middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//serving static files
app.use('/images', express.static(`${path.join(__dirname)}/public/img/`));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/funds', fundRouter);
app.use('/api/v1/transactions', transactionRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
