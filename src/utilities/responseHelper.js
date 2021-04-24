const ErrorHelper = require('./errorHelper');
const Logger = require('./loggingHelper');
const { updateCache, flushCacheDb } = require('./cacheHelper');

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
    await Logger.log('error', errorResponse);
  }
};

/**
 * @description Default success response for API requests
 * @param {*} response - Response Object
 * @param {Object} data - Returned Data object
 * @returns Resolved Response with Data
 */
const defaultResolve = async (response, data) => {
  // destructure cacheKey from response
  const { cacheKey, flushCache, ...payload } = data;
  response.status(200).json({
    data: payload,
    status: 'success',
  });

  // updateCache
  if (cacheKey) {
    await updateCache(
      cacheKey,
      JSON.stringify({
        data: payload,
        status: 'success',
      })
    );
  }

  if (flushCache) {
    // flush cache
    const result = await flushCacheDb();
    Logger.log('debug', `Cleared Cache: ${result.toString()}`);
  }
};

module.exports = {
  defaultResolve,
  defaultReject,
};
