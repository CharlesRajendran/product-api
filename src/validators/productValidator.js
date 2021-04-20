/* eslint-disable no-unused-vars */
const { fetchAllProducts: fetchAllProductsSchema } = require('../schema/productSchema');

const fetchAllProducts = async (req) => {
  const attributes = { cacheKey: req.cacheKey };
  return fetchAllProductsSchema().validate(attributes);
};

module.exports = {
  fetchAllProducts
};
