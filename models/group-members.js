const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Groupmembers = sequelize.define("groupmembers", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Groupmembers;
