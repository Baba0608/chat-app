const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Users = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  mobilenumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Users;
