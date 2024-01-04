const ChatServices = require("../services/chats");

const getChats = async (req, res, next) => {
  try {
    const id = req.user.dataValues.id;
    // console.log(id);
    const result = await ChatServices.getChats(id);
    // console.log(result);
    return res.status(200).json({ success: true, result, userId: id });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const postChat = async (req, res, next) => {
  try {
    const { message, privateId, to } = req.body;
    const from = req.user.dataValues.id;
    const result = await ChatServices.postChat(message, from, to, privateId);
    return res
      .status(201)
      .json({ success: true, message: "Private message created.", result });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const getChatMessages = async (req, res, next) => {
  try {
    const privateId = req.params.privateid;

    const result = await ChatServices.getMessages(privateId);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

exports.getChats = getChats;
exports.postChat = postChat;
exports.getChatMessages = getChatMessages;
