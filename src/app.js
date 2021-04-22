/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const express = require('express');
const cookieParser = require('cookie-parser');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

const cacheMW = require('./middlewares/checkCacheHit');

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
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Security Middlewares
// Note: not using app.use(helmet()) -> Since, some are not relevant to API's and some will reduce performance such as helmet.noCache(), helmet.dnsPrefetchControl

app.use(helmet.hidePoweredBy());// Will hide `X-Powered-By: Express` header, so, we hide saying it is a express application
app.use(helmet.xssFilter());// Will set the `X-XSS-Protection` header to 1, so, it will sanitize/encode query and body parameter, so we can remove dangerous characters injecting bad code (XSS)
app.use(helmet.noSniff()); // Will set the `X-Content-Type-Options` header to `no-sniff`, so, the browser will not use the content sniffing functionality, so the content-type remains as in server.
app.use(helmet.hsts()); // Will force browsers to communicate to the server only through https

app.use(hpp()); // http parameter pollution protector

// Cache Hits
app.use(cacheMW);

// Request Rate Limit
// Max 150 request for 15 mins for a IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: JSON.stringify(ErrorHelper({ message: 'Too many requests!', statusCode: 429 }))
}));

// slow down after ratelimit passes
// Will slowdown by 500ms with each request after 140th request
app.use(slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 140,
  delayMs: 500
}));

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
