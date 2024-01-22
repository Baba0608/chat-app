const GroupMember = require("../models/group-members");
const Group = require("../models/groups");
const User = require("../models/users");
const GroupChat = require("../models/group-chat");

const { Op } = require("sequelize");

const createGroup = (groupName) => {
  return Group.create({
    groupname: groupName,
  });
};

const addGroupMembers = (users) => {
  return GroupMember.bulkCreate(users);
};

const getGroups = (userId) => {
  return User.findAll({
    attributes: [],
    where: {
      id: userId,
    },
    include: {
      model: Group,
      attributes: ["groupname", ["id", "groupId"]],
      through: {
        attributes: [],
      },
    },
  });
};

const getGroupMembers = (groupId, userId) => {
  return User.findAll({
    attributes: ["id", "mobilenumber"],
    where: {
      id: { [Op.ne]: userId },
    },
    include: {
      model: Group,
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
  return User.findAll({
    attributes: [],
    where: {
      id: userId,
    },
    include: {
      model: Group,
      attributes: ["groupname"],
      where: {
        id: groupId,
      },
    },
  });
};

const getMessages = (groupId) => {
  return GroupChat.findAll({
    attributes: ["message", "userId"],
    where: {
      groupId: groupId,
    },

    include: {
      model: User,
      attributes: ["username", "mobilenumber"],
    },
  });
};

const postMessage = (message, groupId, userId) => {
  return GroupChat.create({
    message: message,
    groupId: groupId,
    userId: userId,
  });
};

const removeParticipant = (userId, groupId) => {
  return GroupMember.destroy({
    where: {
      groupId: groupId,
      userId: userId,
    },
  });
};

const updateAdmin = (userId, groupId, admin) => {
  return GroupMember.update(
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
  return GroupMember.count({
    where: {
      groupId: groupId,
    },
  });
};

const removeGroup = (groupId) => {
  return Group.destroy({
    where: {
      id: groupId,
    },
  });
};

const getAdminCount = (groupId) => {
  return GroupMember.count({
    where: {
      groupId: groupId,
      admin: true,
    },
  });
};

const findParticipant = (groupId) => {
  return GroupMember.findOne({
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
