const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Chats = sequelize.define("chat", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Chats;
