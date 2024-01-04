const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Groups = sequelize.define("group", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  groupname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Groups;
