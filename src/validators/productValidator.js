/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
const slugify = require('slugify');

const { validate } = require('../utilities/validationHelper');
const {
  fetchAllProducts: fetchAllProductsSchema,
  fetchProduct: fetchProductSchema,
  addNewProduct: addNewProductSchema,
  updateProduct: updateProductSchema,
  deleteProduct: deleteProductSchema,
  csvUpload: csvUploadSchema,
} = require('../schema/productSchema');

const { csvFileToJSON } = require('../utilities/csvHelper');

const fetchAllProducts = async (req) => {
  const { page, limit, sortBy } = req.query;

  const attributes = {
    cacheKey: req.cacheKey,
    page: page ? parseInt(page, 10) : null,
    limit: limit ? parseInt(limit, 10) : null,
    sortBy: sortBy || null,
  };

  return validate(fetchAllProductsSchema, attributes);
};

const fetchProduct = async (req) => {
  const attributes = {
    cacheKey: req.cacheKey,
    id: isNaN(req.params.id) ? req.params.id : parseInt(req.params.id, 10), // id can be ID or slug
  };

  return validate(fetchProductSchema, attributes);
};

const addNewProduct = async (req) => {
  const {
    name, brand, image, unit, unit_price
  } = req.body;

  const attributes = {
    name,
    slug: slugify(`${name} ${Math.floor(Math.random() * 1000)}`),
    sku: `${name.slice(0, 2)}-${Math.floor(
      Math.random() * 899 + 100
    )}-${brand.slice(0, 2)}`,
    brand,
    image,
    unit,
    unit_price,
  };

  return validate(addNewProductSchema, attributes);
};

const updateProduct = async (req) => {
  const {
    name, slug, sku, image, unit, unit_price
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

  return validate(updateProductSchema, attributes);
};

const deleteProduct = async (req) => {
  const attributes = {
    id: parseInt(req.params.id, 10),
  };

  return validate(deleteProductSchema, attributes);
};

const csvUpload = async (req) => {
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

  let attributeIndex = {}; // Object to hold the column index of each attribute in CSV
  const products = productsCSV.reduce((productArray, rowArray, index) => {
    let product = {};
    if (index === 0) {
      // first row - header row
      rowArray.forEach((headerCell, headerIndex) => {
        attributeIndex = {
          ...attributeIndex,
          [headerIndex]: headerCell,
        };
      });

      return productArray;
    }
    // data rows
    product = rowArray.reduce(
      (productObj, rowCell, rowIndex) => ({
        ...productObj,
        [attributeIndex[rowIndex]]:
          attributeIndex[rowIndex] === 'unit_price'
            ? parseInt(rowCell, 10)
            : rowCell, // unit price should be number
      }),
      {}
    );

    return [...productArray, product];
  }, []);

  const attributes = {
    fileType: req.file.mimetype,
    products,
  };

  return validate(csvUploadSchema, attributes);
};

module.exports = {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
  csvUpload,
};
