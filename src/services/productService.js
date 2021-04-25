/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const { Op } = require('sequelize');

const Products = require('../models/Product');
const Brands = require('../models/Brand');

const { checkRecordExistByAttribute } = require('../utilities/queryHelper');

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

  // check whether product with it exist
  await checkRecordExistByAttribute(Products, { id });

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
    { ...validUpdateAttributes, updatedAt: Date.now() },
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

const deleteProduct = async (attributes) => {
  const { id } = attributes;

  // check whether product with it exist
  await checkRecordExistByAttribute(Products, { id });

  // Update Product
  await Products.destroy({
    where: {
      id,
    },
  });

  return {
    id,
    flushCache: true,
  };
};

const csvUpload = async (attributes) => {
  const { products } = attributes;

  for (let i = 0; i < products.length; i++) {
    // cannot use promise.all since it will create duplicate data while executing in parallel
    const [brandRecord, created] = await Brands.findOrCreate({
      where: { name: products[i].brand },
    });

    products[i] = {
      ...products[i],
      brand: brandRecord.id,
    };
  }

  const result = await Products.bulkCreate(products);

  return {
    result,
    flushCache: true,
  };
};

module.exports = {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
  csvUpload,
};
