/* eslint-disable no-unused-vars */
const { Op } = require('sequelize');
const Products = require('../models/Product');

const fetchAllProducts = async (attributes) => {
  const {
    cacheKey, page, limit, sortBy
  } = attributes;

  // prepare conditions
  const options = {};
  if (limit) {
    options.offset = page ? (page - 1) * limit : 0;
    options.limit = limit;
  }

  if (sortBy) {
    options.order = [[sortBy, 'ASC']];
  }

  // fetch list of products
  const products = await Products.findAll(options);

  return {
    products,
    cacheKey,
  };
};

const fetchProduct = async (attributes) => {
  const { cacheKey, id } = attributes;

  // fetch list of products
  const products = await Products.findAll({
    where: {
      [Op.or]: [{ id }, { slug: id }],
    },
  });

  return {
    products,
    cacheKey,
  };
};

module.exports = {
  fetchAllProducts,
  fetchProduct,
};
