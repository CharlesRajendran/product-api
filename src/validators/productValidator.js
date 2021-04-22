/* eslint-disable no-unused-vars */
const {
  fetchAllProducts: fetchAllProductsSchema,
} = require('../schema/productSchema');
const ErrorHelper = require('../utilities/errorHelper');

const fetchAllProducts = async (req) => {
  const { page, limit, sortBy } = req.query;

  const attributes = {
    cacheKey: req.cacheKey,
    page: page ? parseInt(page, 10) : null,
    limit: limit ? parseInt(limit, 10) : null,
    sortBy: sortBy || null,
  };

  // Validate request parameters with schema
  const result = fetchAllProductsSchema().validate(attributes);

  console.log(attributes, result);
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

module.exports = {
  fetchAllProducts,
};
