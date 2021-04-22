const Joi = require('joi');

const fetchAllProducts = () => Joi.object().keys({
  cacheKey: Joi.string(),
  page: Joi.number().allow(null),
  limit: Joi.number().allow(null),
  sortBy: Joi.string().allow(null),
});

module.exports = {
  fetchAllProducts,
};
