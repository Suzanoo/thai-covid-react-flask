require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./appError');
const globalErrorHandler = require('./errorController');

// Express app and body parser with limit, reading data from body into req.body
const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// 1.1) MIDDLEWARES for SECURITY
// Set security HTTP headers
app.use(helmet());

// Limit requests from same API --> see limit value in headers
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// 1.2) MIDDLEWARES
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serving static files
// app.use(express.static(`${__dirname}/public`));

// middleware for showing request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.cookies);

  next();
});

// ROUTE HANDLER ----------------------------------
// Proxy requests to Flask API
const apiProxy = createProxyMiddleware('/api/v1/covid', {
  target: 'http://backend:5000' || 'http://localhost:5000', // URL of Flask API server
  changeOrigin: true, // needed for virtual hosted sites
});

// Route error
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// PORT
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('[INFO] listening on port 4000');
});

app.use('/apivi/covid', apiProxy);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
});

// Handle unhandled rejection
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
