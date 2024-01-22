const ChatServices = require("../services/chats");

const getChats = async (req, res, next) => {
  try {
    const id = req.user.dataValues.id;
    const username = req.user.dataValues.username;
    const mobilenumber = req.user.dataValues.mobilenumber;
    // console.log(id);
    const result = await ChatServices.getChats(id);
    // console.log(result);
    return res.status(200).json({
      success: true,
      result,
      userId: id,
      userName: username,
      mobileNumber: mobilenumber,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const saveChatName = async (req, res, next) => {
  try {
    const { privateId, friendName } = req.body;
    const userId = req.user.dataValues.id;
    const result = await ChatServices.saveChatName(
      userId,
      privateId,
      friendName
    );

    return res
      .status(200)
      .json({ success: true, message: "Friend name updated." });
  } catch (err) {
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
    const privateId = req.params.private_id;

    const result = await ChatServices.getMessages(privateId);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const postFiles = async (req, res, next) => {
  try {
    const file = req.file;
    console.log(file);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

exports.postFiles = postFiles;
exports.getChats = getChats;
exports.postChat = postChat;
exports.getChatMessages = getChatMessages;
exports.saveChatName = saveChatName;
