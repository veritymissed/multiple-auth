const { Sequelize } = require('sequelize');
const configurations = require('./configurations');
exports.postgresConnection = new Sequelize({
  host: configurations().database.host,
  dialect: 'postgres',
  port: configurations().database.port,
  username: configurations().database.user_name,
  database: configurations().database.database_name,
  password: configurations().database.password,
});
