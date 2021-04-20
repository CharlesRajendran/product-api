const ErrorHelper = require('./utilities/errorHelper');
const logger = require('./utilities/loggingHelper');

/**
 * @description Default error response for API requests
 * @param {Object} error - Error object
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
    await logger.log('error', errorResponse);
  }
};

/**
 * @description Default success response for API requests
 * @param {*} response - Response Object
 * @param {Object} data - Returned Data object
 * @returns Resolved Response with Data
 */
const defaultResolve = async (response, data) => {
  response.status(200).json(data);
};

const controller = async (req, res, params) => {
  // If there is no special responses to give, it will use the default response and reject
  const resolve = params.resolve ? params.resolve : defaultResolve;
  const reject = params.reject ? params.reject : defaultReject;

  try {
    // request parameter validation
    const attributes = await params.validator(req);

    // call the service function with validated data
    const data = await params.service(attributes, {});

    return resolve(res, data);
  } catch (err) {
    return reject(err, res);
  }
};

module.exports = controller;
