/* eslint-disable no-unused-vars */
const tableName = 'products';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      sku: {
        type: Sequelize.STRING(12),
        allowNull: false,
        unique: true
      },
      brand: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      image: {
        type: Sequelize.STRING(1000)
      },
      unit: {
        type: Sequelize.STRING(20)
      },
      unit_price: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(tableName);
  }
};
