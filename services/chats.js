const Privatefriends = require("../models/private-friend");
const Users = require("../models/users");
const Privatechat = require("../models/private-chat");

const getChats = (id) => {
  return Privatefriends.findAll({
    attributes: ["friendId", "friendname", "privateId"],
    include: [
      {
        model: Users,
        attributes: ["mobilenumber"],
      },
    ],
    where: {
      userId: id,
    },
  });
};

const postChat = (message, from, to, privateId) => {
  return Privatechat.create({
    message: message,
    privateId: privateId,
    from: from,
    to: to,
  });
};

const getMessages = (privateId) => {
  return Privatechat.findAll({
    where: {
      privateId: privateId,
    },
  });
};

exports.getChats = getChats;
exports.postChat = postChat;
exports.getMessages = getMessages;
