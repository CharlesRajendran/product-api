/* eslint-disable no-irregular-whitespace */
const supertest = require('supertest');
const Products = require('../../../src/models/Product');

const expressApp = require('../../../src/app');

let app;
// jest.mock('../../../src/services/productService.js');

describe('#ProductAPI', () => {
  beforeAll(() => {
    app = supertest(expressApp);
    console.log(`
██ ███    ██ ████████ ███████  ██████  ██████   █████  ████████ ██  ██████  ███    ██     ████████ ███████ ███████ ████████ ███████ 
██ ████   ██    ██    ██      ██       ██   ██ ██   ██    ██    ██ ██    ██ ████   ██        ██    ██      ██         ██    ██      
██ ██ ██  ██    ██    █████   ██   ███ ██████  ███████    ██    ██ ██    ██ ██ ██  ██        ██    █████   ███████    ██    ███████ 
██ ██  ██ ██    ██    ██      ██    ██ ██   ██ ██   ██    ██    ██ ██    ██ ██  ██ ██        ██    ██           ██    ██         ██ 
██ ██   ████    ██    ███████  ██████  ██   ██ ██   ██    ██    ██  ██████  ██   ████        ██    ███████ ███████    ██    ███████           
    `);
  });

  afterAll(() => {
    // Rollback Database Migrations
  });

  describe('##GET / -> Fetch Products', () => {
    it('should return array of products in the database', async () => {
      const response = await app.get('/');
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.products.length).toBe(100);
    });

    it('should support pagination and return only a subset of data when passing page and limit params', async () => {
      const response = await app.get('/?page=10&limit=10');
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.products.length).toBe(10);
    });

    it('should order the result when passing sortBy option in the query param', async () => {
      const response = await app.get('/?sortBy=id');
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.products[0].id).toBeLessThan(
        response.body.data.products[1].id
      );
    });
  });

  describe('##POST / -> Create Products', () => {
    let createdRecordId;
    afterAll(async () => {
      // clear record
      await Products.destroy({
        where: {
          id: createdRecordId,
        },
      });
    });

    it('should create new product when passing correct request body', async () => {
      const response = await app
        .post('/')
        .send({
          name: 'Shoe Blue',
          brand: 'Reebok',
          image: null,
          unit: 'pcs',
          unit_price: 198,
        })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe('success');

      createdRecordId = response.body.data.id;
    });

    it('should send validation error if new product api is called with wrong data', async () => {
      const response = await app
        .post('/')
        .send({
          name: 'Sh', // min length should be 3
          brand: 'Reebok',
          image: null,
          unit: 'pcs',
          unit_price: 198,
        })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(422);
    });
  });

  describe('##PATCH / -> Update Products', () => {
    let recordId;
    beforeAll(async () => {
      // Create Product for Update
      const response = await Products.create({
        name: 'Dummay Product',
        brand: 1,
        slug: 'Dummay-Product-989',
        sku: 'Du-894-Th',
      });

      recordId = response.toJSON().id;
    });

    afterAll(async () => {
      // Delete Created Product
      await Products.destroy({
        where: {
          id: recordId,
        },
      });
    });

    it('should update product when passing correct request body', async () => {
      const response = await app
        .patch(`/${recordId}`)
        .send({
          unit_price: 2000,
        })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should send `not found error` if update request made to a none existing product', async () => {
      const response = await app
        .patch('/1020')
        .send({
          unit_price: 1989,
        })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(404);
    });

    it('should send `validation error` if update request with wrong request parameters', async () => {
      const response = await app
        .patch('/1020')
        .send({
          sku: '43009440390-493-040943', // length 8 - 12
        })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(422);
    });
  });

  describe('##DELETE / -> Update Products', () => {
    let recordId;
    beforeAll(async () => {
      // Create Product for Update
      const response = await Products.create({
        name: 'Dummay Product',
        brand: 1,
        slug: 'Dummay-Product-989',
        sku: 'Du-894-Th',
      });

      recordId = response.toJSON().id;
    });

    it('should delete product when passing correct product id', async () => {
      const response = await app
        .delete(`/${recordId}`)
        .send()
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should send `not found error` if update request made to a none existing product', async () => {
      const response = await app
        .delete('/1020')
        .send()
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(404);
    });
  });
});
