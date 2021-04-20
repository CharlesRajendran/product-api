/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
const faker = require('faker');
const slugify = require('slugify');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let numberOfRecords = 100;
    const data = [];
    while (numberOfRecords--) {
      const name = faker.commerce.productName();
      const brand = faker.company.companyName();

      data.push({
        name,
        brand,
        slug: slugify(`${name} ${Math.floor(Math.random() * 1000)}`),
        sku: `${faker.address.countryCode()}-${faker.commerce.productMaterial().slice(0, 2)}-${brand.slice(0, 2)}-${name.slice(0, 2)}`,
        image: faker.image.imageUrl(),
        unit: 'pcs',
        unit_price: parseInt(faker.commerce.price(), 10),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      });
    }

    try {
      await queryInterface.bulkInsert('products', data, {});
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
