/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const { Op } = require('sequelize');
const Products = require('../models/Product');
const Brands = require('../models/Brand');

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

const addNewProduct = async (attributes) => {
  const {
    name, slug, sku, brand, image, unit, unit_price
  } = attributes;

  // Create or Fetch Brand ID
  const [brandRecord, created] = await Brands.findOrCreate({
    where: { name: brand },
  });

  // fetch list of products
  const newProduct = await Products.create({
    name,
    brand: brandRecord.id,
    slug,
    sku,
    image,
    unit,
    unit_price,
  });

  return {
    ...newProduct.toJSON(),
    flushCache: true,
  };
};

const updateProduct = async (attributes) => {
  const { id } = attributes;

  // Omit the null fields from attribute
  const validUpdateAttributes = Object.keys(attributes)
    .filter((key) => attributes[key] && key !== 'id')
    .reduce(
      (obj, validKey) => ({
        ...obj,
        [validKey]: attributes[validKey],
      }),
      {}
    );

  // Update Product
  await Products.update(
    { ...validUpdateAttributes },
    {
      where: {
        id,
      },
    }
  );

  return {
    id,
    ...validUpdateAttributes,
    flushCache: true,
  };
};

module.exports = {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProduct,
};
