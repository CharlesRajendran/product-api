/* eslint-disable no-irregular-whitespace */
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv-flow');
const cls = require('cls-hooked');

const Logger = require('./loggingHelper');
const ErrorHelper = require('./errorHelper');

if (process.env.NODE_ENV === 'test') {
  dotenv.config();
  const namespace = cls.createNamespace('test-namespace');
  Sequelize.useCLS(namespace);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: (message) => Logger.log('debug', message),
    pool: {
      max: 10,
      min: 0,
    },
  }
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
      ErrorHelper({ message: error.message, statusCode: 500 })
    );
  }
})();

module.exports = sequelize;
