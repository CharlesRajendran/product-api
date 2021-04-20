const Joi = require('joi');

const fetchAllProducts = () => Joi.object().keys({
  cacheKey: Joi.string()
});

module.exports = {
  fetchAllProducts
};
