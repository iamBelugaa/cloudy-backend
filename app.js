const express = require('express');
const httpErrors = require('http-errors');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.disable('x-powered-by');

// --------------- Middlewares --------------- //
app.use(cors());
app.use(helmet());
app.use(compression({ level: 6 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --------------- User Routes --------------- //
app.use('/api', require('./routes/client/auth'));
app.use('/api', require('./routes/client/dashboard'));

// --------------- File Download Routes --------------- //
app.use('/api', require('./routes/download'));

// --------------- Admin Routes --------------- //
app.use('/api/admin', require('./routes/admin/auth'));
app.use('/api/admin', require('./routes/admin/dashboard'));

// --------------- 404 Error Handler --------------- //
app.use((req, res, next) => next(httpErrors.NotFound()));

// --------------- Global Error Handler --------------- //
app.use((error, req, res, next) => {
  if (error.status === 404)
    return res.status(404).json({
      status: 'error',
      error: error.message || 'Not Found.',
      statusCode: 404,
    });
  else {
    if (error.isJoi) error.status = 422;

    return res.status(error.status || 500).json({
      status: 'error',
      statusCode: error.status || 500,
      error: error.message || 'Internal Server Error.',
    });
  }
});

module.exports = app;
