import Joi, { ObjectSchema } from 'joi';

const fetchAllProductsSchema = (): ObjectSchema<any> => Joi.object().keys({
  cacheKey: Joi.string(),
  page: Joi.number().allow(null),
  limit: Joi.number().allow(null),
  sortBy: Joi.string().allow(null),
});

const fetchProductSchema = (): ObjectSchema<any> => Joi.object().keys({
  cacheKey: Joi.string(),
  id: Joi.alternatives(Joi.string(), Joi.number()).required(),
});

const addNewProductSchema = (): ObjectSchema<any> => Joi.object().keys({
  name: Joi.string().min(3).max(100).required(),
  slug: Joi.string().min(3).max(100).required(),
  sku: Joi.string().min(8).max(12).required(),
  brand: Joi.string().min(1).max(100).required(),
  image: Joi.string().allow(null, '').max(1000),
  unit: Joi.string().allow(null, '').max(20),
  unit_price: Joi.number().allow(null, ''),
});

const updateProductSchema = (): ObjectSchema<any> => Joi.object().keys({
  id: Joi.number().required(),
  name: Joi.string().min(3).max(100),
  slug: Joi.string().min(3).max(100),
  sku: Joi.string()
    .min(8)
    .max(12)
    .pattern(new RegExp(/^[a-z]{2}-[\d]{3}-[a-z]{2}$/i)),
  image: Joi.string().allow(null, '').max(1000),
  unit: Joi.string().allow(null, '').max(20),
  unit_price: Joi.number().allow(null, ''),
});

const deleteProductSchema = (): ObjectSchema<any> => Joi.object().keys({
  id: Joi.number().required(),
});

const csvUploadSchema = (): ObjectSchema<any> => Joi.object().keys({
  fileType: Joi.string().valid('text/csv').required(),
  fileSize: Joi.number().max(2000000), // 2MB
  products: Joi.array().items(addNewProductSchema()),
});

export {
  fetchAllProductsSchema,
  fetchProductSchema,
  addNewProductSchema,
  updateProductSchema,
  deleteProductSchema,
  csvUploadSchema,
};
