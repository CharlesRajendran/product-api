const controller = require('../controller');
const productValidator = require('../validators/productValidator');
const productService = require('../services/productService');

const fetchAllProducts = async (req, res) => {
  await controller(req, res, {
    validator: productValidator.fetchAllProducts,
    service: productService.fetchAllProducts,
  });
};

const fetchProduct = async (req, res) => {
  await controller(req, res, {
    validator: productValidator.fetchProduct,
    service: productService.fetchProduct,
  });
};

const addNewProduct = async (req, res) => {
  await controller(req, res, {
    validator: productValidator.addNewProduct,
    service: productService.addNewProduct,
  });
};

const updateProduct = async (req, res) => {
  await controller(req, res, {
    validator: productValidator.updateProduct,
    service: productService.updateProduct,
  });
};

const deleteProduct = async (req, res) => {
  await controller(req, res, {
    validator: productValidator.deleteProduct,
    service: productService.deleteProduct,
  });
};

module.exports = {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
};
