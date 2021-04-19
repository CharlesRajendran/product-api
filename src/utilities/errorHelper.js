const Boom = require('@hapi/boom');

/**
 * @description Wrapper method for error handling
 * @param {Object} error Error object {message: string, statusCode: number}
 * @param error.message Description of the error
 * @param error.statusCode HTTP Status Code of the Error
 * @returns {Object} Returns Boom Object
 */
const ErrorHelper = (error) => {
  switch (error.statusCode) {
    case 400:
      return Boom.badRequest(error.message).output;
    case 401:
      return Boom.unauthorized(error.message).output;
    case 403:
      return Boom.forbidden(error.message).output;
    case 404:
      return Boom.notFound(error.message).output;
    case 405:
      return Boom.methodNotAllowed(error.message).output;
    case 406:
      return Boom.notAcceptable(error.message).output;
    case 408:
      return Boom.clientTimeout(error.message).output;
    case 409:
      return Boom.conflict(error.message).output;
    case 414:
      return Boom.uriTooLong(error.message).output;
    case 415:
      return Boom.unsupportedMediaType(error.message).output;
    case 422:
      return Boom.badData(error.message).output;
    default:
      return Boom.badImplementation('Un known error').output;
  }
};

module.exports = ErrorHelper;
