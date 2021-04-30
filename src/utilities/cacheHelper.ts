import redis, { RedisClient } from 'redis';

const redisClient: RedisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379,
});

/**
 * @description Update redis cache
 * @param {string} key key of the data
 * @param {string} value cache value
 * @param {number} ttl expire in seconds
 * @returns void
 */
const updateCache = (key: string, value:string, ttl = 3600): void => {
  redisClient.setex(key, ttl, value);
};

/**
 * @description Fetch cache value
 * @param key key of the data
 * @returns {string} cached content
 */
const getFromCache = (key: string): Promise<string> => new Promise((resolve, reject) => {
  redisClient.get(key, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  });
});

/**
 * @description Flush cache after updates
 * @returns {void}
 */
const flushCacheDb = (): Promise<any> => new Promise((resolve, reject) => {
  redisClient.flushdb((err, succeeded) => {
    if (err) {
      reject(err);
    }
    resolve(succeeded);
  });
});

export {
  updateCache,
  getFromCache,
  flushCacheDb,
};
