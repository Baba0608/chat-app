const ChatServices = require("../services/chats");

const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    const result = await ChatServices.storeMessage(req, message);

    return res.status(201).json({ success: true, result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const getMessages = async (req, res, next) => {
  try {
    const result = await ChatServices.getMessagesFromDB();

    return res
      .status(200)
      .json({ success: true, result, userId: req.user.dataValues.id });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

exports.sendMessage = sendMessage;
exports.getMessages = getMessages;
