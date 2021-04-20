/* eslint-disable no-unused-vars */
const { fetchAllProducts: fetchAllProductsSchema } = require('../schema/productSchema');
const ErrorHelper = require('../utilities/errorHelper');

const fetchAllProducts = async (req) => {
  const attributes = { cacheKey: req.cacheKey };

  // Validate request parameters with schema
  const result = fetchAllProductsSchema().validate(attributes);
  if (result.error) {
    throw new Error(ErrorHelper({
      message: `Request validation error: ${result.error.message || ''}`,
      statusCode: 422,
    }));
  }

  return attributes;
};

module.exports = {
  fetchAllProducts
};
