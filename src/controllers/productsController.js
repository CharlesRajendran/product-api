/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const path = require('path');
const controller = require('../controller');
const productValidator = require('../validators/productValidator');
const productService = require('../services/productService');
const { defaultResolve } = require('../utilities/responseHelper');
const Logger = require('../utilities/loggingHelper');
const { flushCacheDb } = require('../utilities/cacheHelper');

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
    resolve: async (response, data) => {
      // custom resolve to send 201 status for created resource
      const { flushCache, ...payload } = data;
      response.status(201).json({
        data: payload,
        status: 'success',
      });

      if (flushCache) {
        // flush cache
        const result = await flushCacheDb();
        Logger.log('debug', `Cleared Cache: ${result.toString()}`);
      }
    },
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

const csvUpload = async (req, res) => {
  await controller(req, res, {
    validator: productValidator.csvUpload,
    service: productService.csvUpload,
    resolve: async (response, data) => {
      // custom resolve function since we need to delete upload file
      // Call default resolve
      defaultResolve(response, data);

      // Delete upload folder
      await new Promise((resolve, reject) => {
        fs.rm(
          path.join(__dirname, '../../uploads/'),
          { recursive: true, force: true },
          (err) => {
            if (err) reject(err);
            resolve('Deleted Successfully');
          }
        );
      });
    },
  });
};

module.exports = {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
  csvUpload,
};
