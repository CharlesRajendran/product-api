const { getFromCache } = require('../utilities/cacheHelper');
const Logger = require('../utilities/loggingHelper');

module.exports = async (req, res, next) => {
  try {
    if (req.method.toUpperCase() !== 'GET') {
      next();
    }

    // Construct key from key object
    const key = req.url;
    req.cacheKey = key;

    // Inject cache key to req object for further use in setting up the cache
    const cachedValue = await getFromCache(key);

    if (cachedValue) {
      res.status(304).json({ cachedValue, from: 'Cache' });
      await Logger.log('debug', { key, cachedValue });
    } else next();
  } catch (err) {
    await Logger.log('error', err);
    next();
  }
};
