/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

// Controllers
const productController = require('../controllers/productsController');

/**
 * @swagger
 * /:
 *  get:
 *   summary: Get all products
 *   tags:
 *     - Product
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
 *     description: Successful Response
 *    422:
 *     description: Parameter Validation Error
 *    429:
 *     description: Too Many Requests
 *    500:
 *     description: Internal Server Error
 */
router.get('/', productController.fetchAllProducts);

/**
 * @swagger
 * /:
 *  post:
 *   summary: Create new product
 *   tags:
 *     - Product
 *   description: Add new products to the list of products
 *   consumes:
 *      - application/json
 *   parameters:
 *     - in: body
 *       name: Product
 *       description: Payload for create new product API
 *       schema:
 *         type: object
 *         required:
 *           - name
 *           - brand
 *         properties:
 *           name:
 *             type: string
 *             description: Name of the product
 *           brand:
 *             type: string
 *             description: Brand of the product
 *           image:
 *             type: string
 *             description: Product image URL
 *           unit:
 *             type: string
 *             description: Unit of product
 *           unit_price:
 *             type: number
 *             description: Price per unit of product
 *   responses:
 *    200:
 *     description: Successful Response
 *    422:
 *     description: Parameter Validation Error
 *    429:
 *     description: Too Many Requests
 *    500:
 *     description: Internal Server Error
 */
router.post('/', productController.addNewProduct);

/**
 * @swagger
 * /{id}:
 *  get:
 *   summary: Get product by ID or slug
 *   tags:
 *     - Product
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
 *     description: Successful Response
 *    422:
 *     description: Parameter Validation Error
 *    429:
 *     description: Too Many Requests
 *    500:
 *     description: Internal Server Error
 */
router.get('/:id', productController.fetchProduct);

module.exports = router;
