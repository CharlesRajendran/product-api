/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
const { validate } = require('../utilities/validationHelper');
const {
  fetchAllProducts: fetchAllProductsSchema,
} = require('../schema/productSchema');

const fetchAllProducts = async (req) => {
  const { page, limit, sortBy } = req.query;

  const attributes = {
    cacheKey: req.cacheKey,
    page: page ? parseInt(page, 10) : null,
    limit: limit ? parseInt(limit, 10) : null,
    sortBy: sortBy || null,
  };

  return validate(fetchAllProductsSchema, attributes);
};

const fetchProduct = async (req) => {
  const attributes = {
    cacheKey: req.cacheKey,
    id: isNaN(req.params.id) ? req.params.id : parseInt(req.params.id, 10), // id can be ID or slug
  };

  return validate(fetchAllProductsSchema, attributes);
};

module.exports = {
  fetchAllProducts,
  fetchProduct,
};
