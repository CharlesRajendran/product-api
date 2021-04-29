/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const express = require('express');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const cors = require('cors');

const { graphqlHTTP } = require('express-graphql');
const cacheMW = require('./middlewares/checkCacheHit');

const indexRouter = require('./routes/index');
const ErrorHelper = require('./utilities/errorHelper');

const schema = require('./graphql/index');

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

// Security Middlewares
// Note: not using app.use(helmet()) -> Since, some are not relevant to API's and some will reduce performance such as helmet.noCache(), helmet.dnsPrefetchControl

app.use(helmet.hidePoweredBy()); // Will hide `X-Powered-By: Express` header, so, we hide saying it is a express application

app.use(helmet.xssFilter()); // Will set the `X-XSS-Protection` header to 0, so, it will sanitize/encode query and body parameter, so we can remove dangerous characters injecting bad code (XSS)

app.use(helmet.noSniff()); // Will set the `X-Content-Type-Options` header to `no-sniff`, so, the browser will not use the content sniffing functionality, so the content-type remains as in server.

app.use(helmet.hsts()); // Will force browsers to communicate to the server only through https

app.use(hpp()); // http parameter pollution protector

app.use(cors());

// Cache Hits
app.use(cacheMW);

// Request Rate Limit
// Max 150 request for 15 mins for a IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: JSON.stringify(
      ErrorHelper({ message: 'Too many requests!', statusCode: 429 })
    ),
  })
);

// slow down after ratelimit passes
// Will slowdown by 500ms with each request after 140th request
app.use(
  slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 140,
    delayMs: 500,
  })
);

// Routes
app.options('/*', (req, res) => {
  // Return CORS headers
  res.cors().send({});
});

// GraphQL
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// REST
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/', indexRouter);

// handling unmatched routes
app.use(
  (req, res) => ErrorHelper({
    message: `Cannot find ${req.method} endpoint for ${req.path}`,
    statusCode: 404,
  }).payload
);

module.exports = app;
