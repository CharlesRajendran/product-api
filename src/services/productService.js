/* eslint-disable no-unused-vars */
const Products = require('../models/Product');

const fetchAllProducts = async (attributes) => {
  // fetch list of products
  const products = await Products.findAll();

  return {
    products,
    cacheKey: attributes.cacheKey
  };
};

module.exports = {
  fetchAllProducts
};
