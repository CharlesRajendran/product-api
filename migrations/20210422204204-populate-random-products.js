/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
const faker = require('faker');
const slugify = require('slugify');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let numberOfRecords = 20;
    const data = [];
    while (numberOfRecords--) {
      const name = `${faker.commerce.productName()} ${faker.company.companyName()}`;

      data.push({
        name,
        brand: Math.floor(Math.random() * 5 + 1),
        slug: slugify(`${name} ${Math.floor(Math.random() * 1000)}`),
        sku: `${name.slice(0, 2)}-${Math.floor(
          Math.random() * 899 + 100 // so number will be 100 - 999, so will meet 8 character constraint always
        )}-${faker.company.companyName().slice(0, 3)}`,
        image: faker.image.imageUrl(),
        unit: 'pcs',
        unit_price: parseInt(faker.commerce.price(), 10),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      });
    }

    try {
      await queryInterface.bulkInsert('products', data, {});
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  },
};
