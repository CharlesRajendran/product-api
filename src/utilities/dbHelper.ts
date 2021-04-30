/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
/* eslint-disable no-irregular-whitespace */
import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv-flow';
import Logger from './loggingHelper';
import ErrorHelper from './errorHelper';

if (process.env.NODE_ENV === 'test') {
  dotenv.config();
}

const sequelize: Sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    dialect: 'mysql',
    logging:
      process.env.NODE_ENV === 'test'
        ? false
        : (message) => Logger.log('debug', message), // test to not to show the transaction log
    pool: {
      max: 10,
      min: 0,
    },
  },
);

// Show DB Status
(async () => {
  try {
    await sequelize.authenticate();
    Logger.log('debug', 'Connection has been established successfully.');
    if (process.env.NODE_ENV !== 'test') {
      console.log(`
███████ ███████ ██████  ██    ██ ███████ ██████      ██████  ██    ██ ███    ██ ███    ██ ██ ███    ██  ██████  
██      ██      ██   ██ ██    ██ ██      ██   ██     ██   ██ ██    ██ ████   ██ ████   ██ ██ ████   ██ ██       
███████ █████   ██████  ██    ██ █████   ██████      ██████  ██    ██ ██ ██  ██ ██ ██  ██ ██ ██ ██  ██ ██   ███ 
     ██ ██      ██   ██  ██  ██  ██      ██   ██     ██   ██ ██    ██ ██  ██ ██ ██  ██ ██ ██ ██  ██ ██ ██    ██ 
███████ ███████ ██   ██   ████   ███████ ██   ██     ██   ██  ██████  ██   ████ ██   ████ ██ ██   ████  ██████  
      `);
    }
  } catch (error) {
    Logger.log(
      'error',
      ErrorHelper({ message: error.message, statusCode: 500 }),
    );
  }
})();

export = sequelize;
