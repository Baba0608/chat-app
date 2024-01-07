const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Groupchat = sequelize.define("groupchat", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  message: {
    type: Sequelize.STRING,
  },

  groupId: {
    type: Sequelize.INTEGER,
  },

  userId: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Groupchat;
