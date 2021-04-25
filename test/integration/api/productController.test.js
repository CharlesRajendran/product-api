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
  });
});
