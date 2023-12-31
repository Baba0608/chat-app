const Groupmembers = require("../models/group-members");
const Groups = require("../models/groups");
const Users = require("../models/users");
const Groupchats = require("../models/group-chat");

const { Op } = require("sequelize");

const createGroup = (groupName) => {
  return Groups.create({
    groupname: groupName,
  });
};

const addGroupMembers = (users) => {
  return Groupmembers.bulkCreate(users);
};

const getGroups = (userId) => {
  return Users.findAll({
    attributes: [],
    where: {
      id: userId,
    },
    include: {
      model: Groups,
      attributes: ["groupname", ["id", "groupId"]],
      through: {
        attributes: [],
      },
    },
  });
};

const getGroupMembers = (groupId, userId) => {
  return Users.findAll({
    attributes: ["id", "mobilenumber"],
    where: {
      id: { [Op.ne]: userId },
    },
    include: {
      model: Groups,
      attributes: ["groupname"],
      where: {
        id: groupId,
      },
      through: {
        attributes: ["admin"],
      },
    },
  });
};

const isAdmin = (groupId, userId) => {
  return Users.findAll({
    attributes: [],
    where: {
      id: userId,
    },
    include: {
      model: Groups,
      attributes: ["groupname"],
      where: {
        id: groupId,
      },
    },
  });
};

const getMessages = (groupId) => {
  return Groupchats.findAll({
    attributes: ["message", "userId"],
    where: {
      groupId: groupId,
    },

    include: {
      model: Users,
      attributes: ["username", "mobilenumber"],
    },
  });
};

const postMessage = (message, groupId, userId) => {
  return Groupchats.create({
    message: message,
    groupId: groupId,
    userId: userId,
  });
};

const removeParticipant = (userId, groupId) => {
  return Groupmembers.destroy({
    where: {
      groupId: groupId,
      userId: userId,
    },
  });
};

const updateAdmin = (userId, groupId, admin) => {
  return Groupmembers.update(
    {
      admin: admin,
    },
    {
      where: {
        userId: userId,
        groupId: groupId,
      },
    }
  );
};

const getGroupCount = (groupId) => {
  return Groupmembers.count({
    where: {
      groupId: groupId,
    },
  });
};

const removeGroup = (groupId) => {
  return Groups.destroy({
    where: {
      id: groupId,
    },
  });
};

const getAdminCount = (groupId) => {
  return Groupmembers.count({
    where: {
      groupId: groupId,
      admin: true,
    },
  });
};

const findParticipant = (groupId) => {
  return Groupmembers.findOne({
    where: {
      groupId: groupId,
    },
  });
};

exports.findParticipant = findParticipant;
exports.getAdminCount = getAdminCount;
exports.removeGroup = removeGroup;
exports.getGroupCount = getGroupCount;
exports.updateAdmin = updateAdmin;
exports.removeParticipant = removeParticipant;
exports.isAdmin = isAdmin;
exports.createGroup = createGroup;
exports.addGroupMembers = addGroupMembers;
exports.getGroups = getGroups;
exports.getGroupMembers = getGroupMembers;
exports.getMessages = getMessages;
exports.postMessage = postMessage;
