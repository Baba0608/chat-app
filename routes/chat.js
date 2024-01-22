const express = require("express");

const authorization = require("../middleware/auth");
const chatControllers = require("../controllers/chat");

const router = express.Router();

router.get("/chats", authorization, chatControllers.getChats);

router.post("/save_chat_name", authorization, chatControllers.saveChatName);

router.post("/send_message", authorization, chatControllers.postChat);

router.get("/messages/:private_id", chatControllers.getChatMessages);

module.exports = router;
