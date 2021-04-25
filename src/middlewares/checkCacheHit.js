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
        // interntionally putting status code 200 over 204 or 304 for caching
        // since graphql client is not properly working with loading server side caching.
        // therefore for response body will be empty because of 304 (not modified)
        res.status(200).json(JSON.parse(cachedValue));
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
