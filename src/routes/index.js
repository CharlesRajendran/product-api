/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

// Controllers
const productController = require('../controllers/productsController');

const { updateCache } = require('../utilities/cacheHelper');

/**
 * @swagger
 * /
 * get:
 *  description: Fetch all the products
 *  parameters:
 *    - name: page
 *      in: query
 *      required: false
 *      type: number
 *    - name: limit
 *      in: query
 *      required: false
 *      type: number
 *  responses:
 *    200:
 *      description: Fetch list of products
 */
router.get('/', productController.fetchAllProducts);

router.post('/', (req, res, next) => {
  const { value } = req.body;
  res.json({
    message: value === 'Respond with a resource POST' ? 'Respond with a resource' : 'Respond with a resource POST'
  });

  // update cache
  updateCache(req.cacheKey, value);
});

module.exports = router;
