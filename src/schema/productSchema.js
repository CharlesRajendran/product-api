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

module.exports = {
  fetchAllProducts,
  fetchProduct,
};
