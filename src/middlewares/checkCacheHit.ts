/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { Request, Response, NextFunction } from 'express';
import { getFromCache } from '../utilities/cacheHelper';
import Logger from '../utilities/loggingHelper';

const cacheHit = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (req.method.toUpperCase() !== 'GET') {
      next();
    }

    // Construct key from key object
    if (req.method === 'GET') {
      const key:string = encodeURIComponent(
        `${req.url}-${JSON.stringify(req.query)}-${JSON.stringify(req.params)}`,
      );

      // Inject cache key to req object for further use in setting up the cache
      const cachedValue = await getFromCache(key);

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

export = cacheHit;
