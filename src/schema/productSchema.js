const Joi = require('joi');

const fetchAllProducts = () => Joi.object().keys({
  cacheKey: Joi.string(),
  page: Joi.number().allow(null),
  limit: Joi.number().allow(null),
  sortBy: Joi.string().allow(null),
});

const fetchProduct = () => Joi.object().keys({
  cacheKey: Joi.string(),
  id: Joi.alternatives(Joi.string(), Joi.number()).required(),
});

const addNewProduct = () => Joi.object().keys({
  name: Joi.string().min(3).max(100).required(),
  slug: Joi.string().min(3).max(100).required(),
  sku: Joi.string().min(8).max(12).required(),
  brand: Joi.string().min(1).max(100).required(),
  image: Joi.string().allow(null, '').max(1000),
  unit: Joi.string().allow(null, '').max(20),
  unit_price: Joi.number().allow(null, ''),
});

const updateProduct = () => Joi.object().keys({
  id: Joi.number().required(),
  name: Joi.string().min(3).max(100),
  slug: Joi.string().min(3).max(100),
  sku: Joi.string()
    .min(8)
    .max(12)
    .pattern(new RegExp(/^[a-z]{2}-[\d]{3}-[a-z]{2}$/i)),
  image: Joi.string().allow(null, '').max(1000),
  unit: Joi.string().allow(null, '').max(20),
  unit_price: Joi.number().allow(null, ''),
});

module.exports = {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProduct,
};
