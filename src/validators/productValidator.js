/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
const slugify = require('slugify');
const { validate } = require('../utilities/validationHelper');
const {
  fetchAllProducts: fetchAllProductsSchema,
  fetchProduct: fetchProductSchema,
  addNewProduct: addNewProductSchema,
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

  return validate(fetchProductSchema, attributes);
};

const addNewProduct = async (req) => {
  const {
    name, brand, image, unit, unit_price
  } = req.body;

  const attributes = {
    name,
    slug: slugify(`${name} ${Math.floor(Math.random() * 1000)}`),
    sku: `${name.slice(0, 2)}-${Math.floor(Math.random() * 999)}-${brand.slice(
      0,
      2
    )}`,
    brand,
    image,
    unit,
    unit_price,
  };

  return validate(addNewProductSchema, attributes);
};

module.exports = {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
};
