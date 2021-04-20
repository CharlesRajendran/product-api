const { Sequelize } = require('sequelize');

const Logger = require('./loggingHelper');
const ErrorHelper = require('./errorHelper');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: (message) => Logger.log('debug', message),
  pool: {
    max: 10,
    min: 0
  }
});

// Show DB Status
(async () => {
  try {
    await sequelize.authenticate();
    Logger.log('info', 'Connection has been established successfully.');
  } catch (error) {
    Logger.log('error', ErrorHelper({ message: error.message, statusCode: 500 }));
  }
})();

module.exports = sequelize;
