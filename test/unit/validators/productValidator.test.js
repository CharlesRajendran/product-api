/* eslint-disable import/no-unresolved */
/* eslint-disable jest/no-try-expect */
/* eslint-disable jest/no-conditional-expect */
const faker = require('faker');
const {
  addNewProduct,
  csvUpload,
} = require('../../../dist/src/validators/productValidator');

describe('#ProductValidator', () => {
  describe('##AddNewProductValidator', () => {
    it('should return valid attributes for creating new product if request body is correct', async () => {
      // AAA
      const req = {
        body: {
          name: faker.commerce.productName(),
          brand: faker.company.companyName(),
          image: faker.image.imageUrl(),
          unit: 'pcs',
          unit_price: faker.commerce.price(),
        },
      };

      const actual = await addNewProduct(req);

      expect(actual).toHaveProperty(
        'name',
        'brand',
        'slug',
        'sku',
        'image',
        'unit',
        'unit_price'
      );
      expect(actual.sku.length).toBeGreaterThanOrEqual(8);
      expect(actual.sku.length).toBeLessThanOrEqual(12);
      expect(actual.sku).toMatch(
        new RegExp('^[a-zA-Z]{2}-[\\d+]{3}-[a-zA-Z]{2}$')
      );
      expect(actual.slug).toMatch(new RegExp('^[a-zA-Z0-9\\-]+-[\\d+]{1,3}$'));
    });

    it('should throw Bad Request Error, if request body contain falsy value for required fields', async () => {
      const req = {
        body: {
          name: null,
          brand: faker.company.companyName(),
          image: faker.image.imageUrl(),
          unit: 'pcs',
          unit_price: faker.commerce.price(),
        },
      };
      try {
        await addNewProduct(req);
      } catch (err) {
        expect(err.code).toBe(400);
      }
    });

    it('should throw Validation Error, if request body contain invalid values for fields', async () => {
      const req = {
        body: {
          name: 'LK', // min length 3
          brand: faker.company.companyName(),
          image: faker.image.imageUrl(),
          unit: 'pcs',
          unit_price: faker.commerce.price(),
        },
      };
      try {
        await addNewProduct(req);
      } catch (err) {
        expect(err.code).toBe(422);
      }
    });
  });

  describe('##BulkInsertProductValidator', () => {
    it('should parse CSV to valid JSON attributes for product bulk insert if file request is correct', async () => {
      const req = {
        file: {
          mimetype: 'text/csv',
          path: `${__dirname}/../../data/data.csv`,
        },
      };

      const actual = await csvUpload(req);
      const expected = [
        {
          name: 'Chiffon spaghetti dress long true blue',
          brand: 'Ivy & Oak',
          slug: 'chiffon-spaghetti-dress-long-true-blue',
          unit: 'pcs',
          sku: 'Ch-971-Iv',
          unit_price: 199,
        },
        {
          name: 'Chiffon spaghetti dress long yellow',
          brand: 'Ivy & Oak',
          slug: 'chiffon-spaghetti-dress-long-yellow',
          unit: 'pcs',
          sku: 'Ch-671-Iv',
          unit_price: 169,
        },
      ];

      expect(actual.products).toEqual(expected);
    });
  });
});
