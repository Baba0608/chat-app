const Sequelize = require("sequelize");

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const database = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: "mysql",
});

module.exports = database;
