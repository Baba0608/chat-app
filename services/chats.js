const Chats = require("../models/chats");
const Users = require("../models/users");

const storeMessage = (req, message) => {
  return req.user.createChat({
    message: message,
  });
};

const getMessagesFromDB = () => {
  return Chats.findAll({
    attributes: ["id", "message"],
    include: [
      {
        model: Users,
        attributes: ["username", "id"],
      },
    ],
  });
};

exports.storeMessage = storeMessage;
exports.getMessagesFromDB = getMessagesFromDB;
