/* eslint-disable no-unused-vars */
const Products = require('../models/Product');

const fetchAllProducts = async (attributes) => {
  console.log(Products);
  // fetch list of products
  const products = await Products.findAll();
  return {
    message: 'Hi there bro....',
    products,
    from: 'API'
  };
};

module.exports = {
  fetchAllProducts
};
