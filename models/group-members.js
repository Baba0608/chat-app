const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Groupmembers = sequelize.define("groupmembers", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Groupmembers;
