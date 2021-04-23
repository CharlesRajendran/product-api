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
 *    422:
 *     description: Parameter validation failed
 *    429:
 *     description: Too many requests
 *    500:
 *     description: Internal server error
 */
router.get('/', productController.fetchAllProducts);

/**
 * @swagger
 * /{id}:
 *  get:
 *   summary: Get product by ID or slug
 *   description: Fetch product information using ID or slug
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: id or slug
 *   responses:
 *    200:
 *     description: Ok response with all todos
 *    422:
 *     description: Parameter validation error
 *    429:
 *     description: Too many requests
 *    500:
 *     description: Internal server error
 */
router.get('/:id', productController.fetchProduct);

router.post('/', (req, res, next) => {});

module.exports = router;
