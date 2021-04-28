/* eslint-disable no-unused-vars */
const tableName = 'brands';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      address: {
        type: Sequelize.STRING(1000),
      },
      city: {
        type: Sequelize.STRING(100),
      },
      country: {
        type: Sequelize.STRING(100),
      },
      zip_code: {
        type: Sequelize.STRING(100),
      },
      country_code: {
        type: Sequelize.STRING(100),
      },
      reference: {
        type: Sequelize.STRING(100),
      },
      website: {
        type: Sequelize.STRING(1000),
      },
      email: {
        type: Sequelize.STRING(1000),
      },
      phone: {
        type: Sequelize.STRING(1000),
      },
      bank_account: {
        type: Sequelize.STRING(1000),
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(tableName);
  },
};
