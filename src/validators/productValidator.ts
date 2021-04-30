/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
import { Request } from 'express';
import slugify from 'slugify';
import { validate } from '../utilities/validationHelper';
import {
  fetchAllProductsSchema,
  fetchProductSchema,
  addNewProductSchema,
  updateProductSchema,
  deleteProductSchema,
  csvUploadSchema,
} from '../schema/productSchema';
import { csvFileToJSON } from '../utilities/csvHelper';

const fetchAllProducts = async (req: Request): Promise<any> => {
  const { page, limit, sortBy } = req.query;

  const cacheKey:string = encodeURIComponent(
    `${req.url}-${JSON.stringify(req.query)}-${JSON.stringify(req.params)}`,
  );

  const attributes = {
    cacheKey,
    page: page ? parseInt(page.toString(), 10) : null,
    limit: limit ? parseInt(limit.toString(), 10) : null,
    sortBy: sortBy || null,
  };

  return validate(fetchAllProductsSchema(), attributes);
};

const fetchProduct = async (req: Request): Promise<any> => {
  const cacheKey:string = encodeURIComponent(
    `${req.url}-${JSON.stringify(req.query)}-${JSON.stringify(req.params)}`,
  );

  const attributes = {
    cacheKey,
    id: Number.isNaN(req.params.id) ? req.params.id : parseInt(req.params.id, 10), // id can be ID or slug
  };

  return validate(fetchProductSchema(), attributes);
};

const addNewProduct = async (req: Request): Promise<any> => {
  const {
    name, brand, image, unit, unit_price,
  } = req.body;

  if (!name || !brand) {
    const Err:any = new Error('Passing falsy values for required fields');
    Err.code = 400;

    throw Err;
  }

  const attributes = {
    name,
    slug: slugify(`${name} ${Math.floor(Math.random() * 1000)}`),
    sku: `${name.slice(0, 2)}-${Math.floor(
      Math.random() * 899 + 100,
    )}-${brand.slice(0, 2)}`,
    brand,
    image,
    unit,
    unit_price,
  };

  return validate(addNewProductSchema(), attributes);
};

const updateProduct = async (req: Request): Promise<any> => {
  const {
    name, slug, sku, image, unit, unit_price,
  } = req.body;

  const attributes = {
    id: parseInt(req.params.id, 10),
    name,
    slug,
    sku,
    image,
    unit,
    unit_price,
  };

  return validate(updateProductSchema(), attributes);
};

const deleteProduct = async (req: Request): Promise<any> => {
  const attributes = {
    id: parseInt(req.params.id, 10),
  };

  return validate(deleteProductSchema(), attributes);
};

const csvUpload = async (req: Request): Promise<any> => {
  const productsCSV = await csvFileToJSON(req.file.path);

  // Convert CSV Array to Product JSON Array
  /**
   * ===================== Product CSV JSON ======================
   * "products": [
      [
        "name",
        "brand",
        "slug",
        "unit",
        "sku",
        "unit_price"
      ],
      [
        "Chiffon spaghetti dress long true blue",
        "Ivy & Oak",
        "chiffon-spaghetti-dress-long-true-blue",
        "pcs",
        "Ch-97-Iv",
        "199"
      ],
      ......
    ]
   *
   * ================ Expected JSON =============================
   * "products": [
      {
        "name": "Chiffon spaghetti dress long true blue",
        "brand": "Ivy & Oak",
        "slug": "chiffon-spaghetti-dress-long-true-blue",
        "unit": "pcs",
        "sku": "Ch-97-Iv",
        "unit_price": "199"
      },
      {
        "name": "Chiffon spaghetti dress long yellow",
        "brand": "Ivy & Oak",
        "slug": "chiffon-spaghetti-dress-long-yellow",
        "unit": "pcs",
        "sku": "Ch-671-Iv",
        "unit_price": "169"
      },
      ...
    ]
   */

  let attributeIndex:any = {}; // Object to hold the column index of each attribute in CSV
  const products = productsCSV.reduce((productArray: any, rowArray: any, index: number) => {
    let product = {};
    if (index === 0) {
      // first row - header row
      rowArray.forEach((headerCell: any, headerIndex: number) => {
        attributeIndex = {
          ...attributeIndex,
          [headerIndex]: headerCell,
        };
      });

      return productArray;
    }
    // data rows
    product = rowArray.reduce(
      (productObj: any, rowCell: any, rowIndex: number) => ({
        ...productObj,
        [attributeIndex[rowIndex]]:
          attributeIndex[rowIndex] === 'unit_price'
            ? parseInt(rowCell, 10)
            : rowCell, // unit price should be number
      }),
      {},
    );

    return [...productArray, product];
  }, []);

  const attributes = {
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    products,
  };

  return validate(csvUploadSchema(), attributes);
};

export = {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
  csvUpload,
};
