/* eslint-disable no-unused-vars */
const Products = require('../models/Product');

const fetchAllProducts = async (attributes) => {
  const {
    cacheKey, page, limit, sortBy
  } = attributes;

  // prepare conditions
  const options = {};
  if (limit) {
    options.offset = page ? page * limit : 0;
    options.limit = limit;
  }

  if (sortBy) {
    options.order = [[sortBy, 'ASC']];
  }

  console.log('CHDLLK: ', options);

  // fetch list of products
  const products = await Products.findAll(options);

  return {
    products,
    cacheKey,
  };
};

module.exports = {
  fetchAllProducts,
};
