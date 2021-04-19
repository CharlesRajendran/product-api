/* eslint-disable no-unused-vars */
const express = require('express');
const { updateCache } = require('../utilities/cacheHelper');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({
    message: 'Respond with a resource',
  });
});

router.post('/', (req, res, next) => {
  const { value } = req.body;
  res.json({
    message: value === 'Respond with a resource POST' ? 'Respond with a resource' : 'Respond with a resource POST'
  });

  // update cache
  updateCache(req.cacheKey, value);
});

module.exports = router;
