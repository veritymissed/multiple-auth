const { Sequelize } = require('sequelize');
exports.postgresConnection = new Sequelize({
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  username: 'postgres',
  database: 'postgres',
  password: 'postgrespassword',
});
