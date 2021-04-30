/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import express, { Express, Request, Response } from 'express';

import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import * as swaggerUI from 'swagger-ui-express';

import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import cors from 'cors';

import { graphqlHTTP } from 'express-graphql';
import cacheMW from './middlewares/checkCacheHit';

import indexRouter from './routes/index';

import ErrorHelper from './utilities/errorHelper';

import schema from './graphql/index';

const app:Express = express();

// swagger documentation
const swaggerOptions: Options = {
  definition: {
    info: {
      title: 'Products API',
      version: '1.0.0',
      description: 'API for performaing actions to Products',
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['./src/routes/*.ts'],
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
      ErrorHelper({ message: 'Too many requests!', statusCode: 429 }),
    ),
  }),
);

// slow down after ratelimit passes
// Will slowdown by 500ms with each request after 140th request
app.use(
  slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 140,
    delayMs: 500,
  }),
);

/* Routes */
// GraphQL
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

// REST
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/', indexRouter);

// handling unmatched routes
app.use(
  (req: Request, res: Response) => ErrorHelper({
    message: `Cannot find ${req.method} endpoint for ${req.path}`,
    statusCode: 404,
  }).payload,
);

export = app;
