const ErrorHelper = require('./errorHelper');

/**
 * @description Common validate function for request paramter validation against Joi schema
 * @param {Object} validateFunction Joi schema validator
 * @param {Object} attributes Paramter Object
 * @returns {Object} Validated Attributes
 */
module.exports.validate = async (validateFunction, attributes) => {
  const result = validateFunction().validate(attributes, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (result.error) {
    throw new Error(
      ErrorHelper({
        message: `Request validation error: ${result.error.message || ''}`,
        statusCode: 422,
      })
    );
  }

  return attributes;
};
