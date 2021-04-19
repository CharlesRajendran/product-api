const ErrorHelper = require('./errorHelper');
const Logger = require('./loggingHelper');

async function errorLog(level, errResponse) {
  const logger = new Logger(process.env.LAMBDA_STAGE);
  await logger.log(level, errResponse);
}

/**
 * @param {Object} error - Application Error
 * @param {*} response - Response object
 * @returns Reject Response with Error Object
 */
const defaultReject = async (error, response) => {
  const boomError = ErrorHelper({
    message: error.message,
    statusCode: error.code,
  }).payload;

  const errorResponse = {
    ...boomError,
    stackTrace: error.stack,
  };

  response.status(boomError.statusCode).json(boomError);

  // only 500 errors are unknow error which needs to be reported
  // other errors are handled
  if (boomError.statusCode >= 500) {
    await errorLog('error', errorResponse);
  }
};

/**
 * @param {*} response - Response Object
 * @param {Object} data - Returned Data object
 * @returns Resolved Response with Data
 */
const defaultResolve = async (response, data) => {
  response.status(200).json(data);
};

module.exports = {
  defaultReject,
  defaultResolve,
};
