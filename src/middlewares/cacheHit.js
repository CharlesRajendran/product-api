const { getFromCache } = require('../utilities/cacheHelper');
const logger = require('../utilities/loggingHelper');

module.exports = async (req, res, next) => {
  try {
    if (req.method.toUpperCase() !== 'GET') {
      next();
    }

    // Construct key from key object
    const key = req.url + JSON.stringify(req.params) + JSON.stringify(req.query);
    await logger.log('debug', key);

    // Inject cache key to req object for further use in setting up the cache
    const cachedValue = await getFromCache(key);
    if (cachedValue) res.json({ cachedValue, responseFrom: 'cache' });
    else next();
  } catch (err) {
    logger.log('error', JSON.stringify(err));
    next();
  }
};
