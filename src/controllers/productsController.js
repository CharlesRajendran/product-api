const controller = require('../controller');
const productValidator = require('../validators/productValidator');
const productService = require('../services/productService');

const fetchAllProducts = async (req, res) => {
  await controller(req, res, {
    validator: productValidator.fetchAllProducts,
    service: productService.fetchAllProducts,
  });
};

module.exports = {
  fetchAllProducts
};
