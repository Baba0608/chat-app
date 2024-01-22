const PrivateFriend = require("../models/private-friend");
const User = require("../models/users");
const PrivateChat = require("../models/private-chat");

const getChats = (id) => {
  return PrivateFriend.findAll({
    attributes: ["friendId", "friendname", "privateId"],
    include: [
      {
        model: User,
        attributes: ["mobilenumber"],
      },
    ],
    where: {
      userId: id,
    },
  });
};

const postChat = (message, from, to, privateId) => {
  return PrivateChat.create({
    message: message,
    privateId: privateId,
    from: from,
    to: to,
  });
};

const getMessages = (privateId) => {
  return PrivateChat.findAll({
    where: {
      privateId: privateId,
    },
  });
};

const saveChatName = (userId, privateId, friendName) => {
  return PrivateFriend.update(
    {
      friendname: friendName,
    },
    {
      where: {
        userId: userId,
        privateId: privateId,
      },
    }
  );
};

exports.getChats = getChats;
exports.postChat = postChat;
exports.getMessages = getMessages;
exports.saveChatName = saveChatName;
