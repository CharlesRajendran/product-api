const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379
});

module.exports.updateCache = (key, value, ttl = 3600) => {
  redisClient.setex(key, ttl, value);
};

module.exports.getFromCache = (key) => new Promise((resolve, reject) => {
  redisClient.get(key, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  });
});
