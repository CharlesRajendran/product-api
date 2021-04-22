/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

// Controllers
const productController = require('../controllers/productsController');

const { updateCache } = require('../utilities/cacheHelper');

/**
 * @swagger
 * /:
 *  get:
 *   summary: Get all products
 *   description: Fetch all the products from database
 *   parameters:
 *    - in: query
 *      name: page
 *      schema:
 *       type: number
 *      required: false
 *      description: page number
 *    - in: query
 *      name: limit
 *      schema:
 *       type: number
 *      required: false
 *      description: number of items per page
 *    - in: query
 *      name: sortBy
 *      schema:
 *       type: string
 *      required: false
 *      description: column name to sort the result
 *   responses:
 *    200:
 *     description: Ok response with all todos
 *    429:
 *     description: Too many requests
 *    500:
 *     description: Internal server error
 */
router.get('/', productController.fetchAllProducts);

router.post('/', (req, res, next) => {});

module.exports = router;
