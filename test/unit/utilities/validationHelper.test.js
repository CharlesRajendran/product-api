/* eslint-disable jest/no-try-expect */
/* eslint-disable jest/no-conditional-expect */
const faker = require('faker');
const Joi = require('joi');
const { validate } = require('../../../src/utilities/validationHelper');

describe('#ValidationUtility', () => {
  describe('##Validate', () => {
    let schema;
    beforeAll(() => {
      schema = () => Joi.object().keys({
        name: Joi.string().required(),
        brand: Joi.string().required(),
        unit_price: Joi.number().allow(null),
      });
    });

    it('should return argument attributes if the attributes are valid', async () => {
      const validAttributes = {
        name: faker.commerce.productName(),
        brand: faker.company.companyName(),
        unit_price: faker.commerce.price(),
      };

      const validActual = await validate(schema, validAttributes);

      expect(validActual).toEqual(validAttributes);
    });

    it('should throw error if the argument attributes are invalid', async () => {
      const invalidAttributes = {
        name: faker.commerce.productName(),
        brand: null,
        unit_price: faker.commerce.price(),
      };

      await expect(validate(schema, invalidAttributes)).rejects.toThrow();
    });
  });
});
