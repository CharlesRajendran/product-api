/* eslint-disable no-unused-vars */
const express = require('express');
const cookieParser = require('cookie-parser');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const cacheMW = require('./middlewares/cacheHit');

const indexRouter = require('./routes/index');
const ErrorHelper = require('./utilities/errorHelper');

const app = express();

// swagger documentation
const swaggerOptions = {
  definition: {
    info: {
      title: 'Products API',
      version: '1.0.0',
      description: 'API for performaing actions to Products',
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// cache hits
app.use(cacheMW);

// Routes
app.options('/*', (req, res) => {
  // Return CORS headers
  res.cors().send({});
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/', indexRouter);

// handling unmatched routes
app.all('*', async (req, res) => {
  res.status(404).send(
    ErrorHelper({
      message: `Cannot find ${req.method} endpoint for ${req.path}`,
      statusCode: 404,
    }).payload
  );
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
