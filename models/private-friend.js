const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Privatefriends = sequelize.define("privatefriend", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  friendId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  friendname: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  privateId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Privatefriends;
