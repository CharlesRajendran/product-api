/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import controller from '../controller';
import productValidator from '../validators/productValidator';
import productService from '../services/productService';
import { defaultResolve } from '../utilities/responseHelper';
import Logger from '../utilities/loggingHelper';
import { flushCacheDb } from '../utilities/cacheHelper';

const fetchAllProducts = async (req: Request, res: Response): Promise<any> => {
  await controller(req, res, {
    validator: productValidator.fetchAllProducts,
    service: productService.fetchAllProducts,
  });
};

const fetchProduct = async (req:Request, res:Response): Promise<any> => {
  await controller(req, res, {
    validator: productValidator.fetchProduct,
    service: productService.fetchProduct,
  });
};

const addNewProduct = async (req:Request, res:Response): Promise<any> => {
  await controller(req, res, {
    validator: productValidator.addNewProduct,
    service: productService.addNewProduct,
    resolve: async (response: Response, data: any): Promise<any> => {
      // custom resolve to send 201 status for created resource
      const { flushCache, ...payload } = data;
      response.status(201).json({
        data: payload,
        status: 'success',
      });

      if (flushCache) {
        // flush cache
        const result = await flushCacheDb();
        Logger.log('debug', `Cleared Cache: ${result.toString()}`);
      }
    },
  });
};

const updateProduct = async (req: Request, res: Response): Promise<any> => {
  await controller(req, res, {
    validator: productValidator.updateProduct,
    service: productService.updateProduct,
  });
};

const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  await controller(req, res, {
    validator: productValidator.deleteProduct,
    service: productService.deleteProduct,
  });
};

const csvUpload = async (req: Request, res: Response): Promise<any> => {
  await controller(req, res, {
    validator: productValidator.csvUpload,
    service: productService.csvUpload,
    resolve: async (response: Response, data: any): Promise<any> => {
      // custom resolve function since we need to delete upload file
      // Call default resolve
      defaultResolve(response, data);

      // Delete upload folder
      await new Promise((resolve, reject) => {
        fs.rm(
          path.join(__dirname, '../../uploads/'),
          { recursive: true, force: true },
          (err) => {
            if (err) reject(err);
            resolve('Deleted Successfully');
          },
        );
      });
    },
  });
};

export = {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
  csvUpload,
};
