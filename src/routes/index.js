/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      const path = `${__dirname}/../../uploads/`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }

      callback(null, path);
    },
    filename: (req, file, callback) => {
      // originalname is the uploaded file's name with extn
      callback(null, file.originalname);
    },
  }),
});

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
 *    304:
 *     description: Not Modified
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
 *    201:
 *     description: Resource Created
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
 *    304:
 *     description: Not Modified
 *    422:
 *     description: Parameter Validation Error
 *    429:
 *     description: Too Many Requests
 *    500:
 *     description: Internal Server Error
 */
router.get('/:id', productController.fetchProduct);

/**
 * @swagger
 * /{id}:
 *  patch:
 *   summary: Update products
 *   tags:
 *     - Product
 *   description: Update product information
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: id or slug
 *    - in: body
 *      name: Product
 *      description: Payload for update product API
 *      schema:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the product
 *          slug:
 *            type: string
 *            description: Slug of the product
 *          sku:
 *            type: string
 *            description: SKU of the product
 *          image:
 *            type: string
 *            description: Product image URL
 *          unit:
 *            type: string
 *            description: Unit of product
 *          unit_price:
 *            type: number
 *            description: Price per unit of product
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
router.patch('/:id', productController.updateProduct);

/**
 * @swagger
 * /{id}:
 *  delete:
 *   summary: Delete products
 *   tags:
 *     - Product
 *   description: Delete product record
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: id
 *   responses:
 *    200:
 *     description: Successful Response
 *    404:
 *     description: Not Found
 *    422:
 *     description: Parameter Validation Error
 *    429:
 *     description: Too Many Requests
 *    500:
 *     description: Internal Server Error
 */
router.delete('/:id', productController.deleteProduct);

/**
 * @swagger
 * /upload:
 *  post:
 *   summary: Bulk CSV Insert
 *   tags:
 *     - Product
 *   description: Upload CSV File to Bulk Insert
 *   consumes:
 *     - multipart/form-data
 *   parameters:
 *     - in: formData
 *       name: datafile
 *       type: file
 *       description: Upload Data CSV File
 *   responses:
 *    200:
 *     description: Successful Response
 *    404:
 *     description: Not Found
 *    422:
 *     description: Parameter Validation Error
 *    429:
 *     description: Too Many Requests
 *    500:
 *     description: Internal Server Error
 */
router.post('/upload', upload.single('datafile'), productController.csvUpload);

module.exports = router;
