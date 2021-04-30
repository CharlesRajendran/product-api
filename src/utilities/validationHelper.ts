/* eslint-disable import/prefer-default-export */
import { ObjectSchema } from 'joi';
/**
 * @description Common validate function for request paramter validation against Joi schema
 * @param {Object} validateFunction Joi schema validator
 * @param {Object} attributes Paramter Object
 * @returns {Object} Validated Attributes
 */
const validate = async (validateFunction: ObjectSchema, attributes: any): Promise<any> => {
  const result = validateFunction.validate(attributes, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (result.error) {
    const Err:any = new Error(
      `Request validation error: ${result.error.message || ''}`,
    );
    Err.code = 422;
    throw Err;
  }

  return attributes;
};

export {
  validate,
};
