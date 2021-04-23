const { getFromCache } = require('../utilities/cacheHelper');
const Logger = require('../utilities/loggingHelper');

module.exports = async (req, res, next) => {
  try {
    if (req.method.toUpperCase() !== 'GET') {
      next();
    }

    // Construct key from key object
    if (req.method === 'GET') {
      const key = encodeURIComponent(
        `${req.url}-${JSON.stringify(req.query)}-${JSON.stringify(req.params)}`
      );
      req.cacheKey = key;

      // Inject cache key to req object for further use in setting up the cache
      const cachedValue = await getFromCache(req.cacheKey);

      if (cachedValue) {
        res.status(304).json({ ...cachedValue });
        await Logger.log('debug', { message: 'Fetched from cache...' });
      } else {
        next();
      }
    }
  } catch (err) {
    await Logger.log('error', err);
    next();
  }
};
