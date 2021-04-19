const _ = require('lodash');

const ApplicationError = require('./ApplicationError');

const validate = async (attributes, validateFunction) => {
  const result = validateFunction().validate(attributes, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (result.error) {
    throw new ApplicationError({
      message: `Request validation error: ${result.error.message || ''}`,
      statusCode: 422,
    });
  }

  return attributes;
};

const clean = (object) => _.omitBy(object, _.isUndefined);

const parseToFloat = (num) => (num ? parseFloat(parseFloat(num).toFixed(2)) : num);

module.exports = {
  parseToFloat,
  validate,
  clean,
};
