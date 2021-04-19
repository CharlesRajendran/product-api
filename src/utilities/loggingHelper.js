const winston = require('winston');
const CloudWatchTransport = require('winston-aws-cloudwatch');

function Logger(environment) {
  this.logger = winston.createLogger({
    levels: winston.config.npm.levels,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  });

  if (environment === 'development') {
    this.logger.add(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize({ all: true })),
        level: 'debug',
      })
    );
    this.logger.add(
      new winston.transports.File({ filename: 'logs/requests.log' })
    );
    this.logger.add(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      })
    );
  } else {
    // for log stream naming - one log stream per day to log
    const today = new Date();
    const logStreamName = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    const loggerCWOptions = {
      logGroupName: process.env.REQUEST_LOG_GROUP_NAME,
      logStreamName,
      createLogGroup: false,
      createLogStream: true,
      awsConfig: {
        accessKeyId: process.env.CW_ACCESS_KEY_ID,
        secretAccessKey: process.env.CW_SECRET_ACCESS_KEY,
        region: process.env.CW_REGION,
      },
    };

    // request cloudwatch
    this.logger.add(new CloudWatchTransport(loggerCWOptions));

    // error cloudwatch
    this.logger.add(
      new CloudWatchTransport({
        ...loggerCWOptions,
        logGroupName: process.env.ERROR_LOG_GROUP_NAME,
        level: 'error',
      })
    );
  }
}

async function waitForLoggerToFinish(logger) {
  const loggerDone = new Promise((resolve) => logger.on('finish', resolve));
  logger.end();
  return loggerDone;
}

Logger.prototype.log = async function log(level, message) {
  if (typeof message === 'object') {
    this.logger.log(level, { message: JSON.stringify(message) });
  } else {
    this.logger.log(level, { message });
  }
  await waitForLoggerToFinish(this.logger);
};

module.exports = new Logger(process.env.NODE_ENV || 'development');
