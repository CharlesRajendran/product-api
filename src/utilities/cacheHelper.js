const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379
});

/**
 * @description Update redis cache
 * @param {string} key key of the data
 * @param {string} value cache value
 * @param {number} ttl expire in seconds
 * @returns void
 */
module.exports.updateCache = (key, value, ttl = 3600) => {
  redisClient.setex(key, ttl, value);
};

/**
 * @description Fetch cache value
 * @param key key of the data
 * @returns {string} cached content
 */
module.exports.getFromCache = (key) => new Promise((resolve, reject) => {
  redisClient.get(key, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  });
});
