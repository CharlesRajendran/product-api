/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let numberOfRecords = 5;
    const data = [];
    while (numberOfRecords--) {
      const name = faker.company.companyName();

      data.push({
        name,
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        country: faker.address.country(),
        zip_code: faker.address.zipCode(),
        country_code: faker.address.countryCode(),
        reference: faker.name.findName(),
        website: faker.internet.domainName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        bank_account: faker.finance.account(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      });
    }

    try {
      await queryInterface.bulkInsert('brands', data, {});
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('brands', null, {});
  },
};
