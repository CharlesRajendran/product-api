import winston, { Logger } from 'winston';

class WinstonLogger {
  logger: Logger;

  constructor() {
    this.logger = winston.createLogger({
      levels: winston.config.npm.levels,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    });

    this.logger.add(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize({ all: true })),
        level: 'debug',
      }),
    );

    this.logger.add(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
    );
  }

  async log(level: string, message: string | any) {
    if (typeof message === 'object') {
      this.logger.log(level, { message: JSON.stringify(message) });
    } else {
      this.logger.log(level, { message });
    }
  }
}

export = new WinstonLogger();
