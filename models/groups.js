const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Groups = sequelize.define("groupnames", {
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
