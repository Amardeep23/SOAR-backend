const express = require('express');
const app = express();
const routes = require('./routes/index.route');
const connectDB = require('./connect/mongo');
const cookieParser = require('cookie-parser');
const { rateLimit } = require("express-rate-limit");



const limiter = rateLimit({
    windowMs: 1* 60 * 1000, // 1 minutes
    limit: 10, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
    standardHeaders: true, 
    legacyHeaders: false, 
  });

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);

connectDB();

// entry point  /api/v1
app.use('/api/v1', routes);

module.exports = app;


