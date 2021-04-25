module.exports = {
  development: {
    username: 'root',
    password: 'root',
    database: 'ProductDB',
    host: 'db',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: 'root',
    database: 'ProductTestDB',
    port: 4306,
    host: '0.0.0.0',
    dialect: 'mysql',
  },
};
