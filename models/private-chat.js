const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Privatechat = sequelize.define("privatechat", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  privateId: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  from: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  to: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Privatechat;
