/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { DataTypes } from 'sequelize';
import db from '../utilities/dbHelper';

const Brand = db.define(
  'brand',
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
    address: {
      type: DataTypes.STRING(1000),
    },
    city: {
      type: DataTypes.STRING(100),
    },
    country: {
      type: DataTypes.STRING(100),
    },
    zip_code: {
      type: DataTypes.STRING(100),
    },
    country_code: {
      type: DataTypes.STRING(100),
    },
    reference: {
      type: DataTypes.STRING(100),
    },
    website: {
      type: DataTypes.STRING(1000),
    },
    email: {
      type: DataTypes.STRING(1000),
    },
    phone: {
      type: DataTypes.STRING(1000),
    },
    bank_account: {
      type: DataTypes.STRING(1000),
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {},
);

export = Brand;
