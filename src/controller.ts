/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Request, Response } from 'express';
import { defaultResolve, defaultReject } from './utilities/responseHelper';

const controller = async (req: Request, res: Response, params: any): Promise<any> => {
  // If there is no special responses to give, it will use the default response and reject
  const resolve = params.resolve ? params.resolve : defaultResolve;
  const reject = params.reject ? params.reject : defaultReject;

  try {
    // request parameter validation
    const attributes = await params.validator(req);

    // call the service function with validated data
    const data = await params.service(attributes, {});
    return resolve(res, data);
  } catch (err) {
    return reject(err, res);
  }
};

export = controller;
