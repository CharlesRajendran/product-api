const { DataTypes } = require('sequelize');

const db = require('../utilities/dbHelper');

const Product = db.define(
  'product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, // will create a index as well
    },
    sku: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true, // will create a index as well
    },
    brand: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(1000),
    },
    unit: {
      type: DataTypes.STRING(20),
    },
    unit_price: {
      type: DataTypes.FLOAT,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {}
);

Product.associate = (models) => {
  Product.belongsTo(models.Brand, {
    foreignKey: 'brand',
  });
};

module.exports = Product;
