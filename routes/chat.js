const express = require("express");

const authorization = require("../middleware/auth");
const chatControllers = require("../controllers/chat");

const router = express.Router();

router.get("/getchats", authorization, chatControllers.getChats);

router.post("/sendmessage", authorization, chatControllers.postChat);

router.get("/getmessages/:privateid", chatControllers.getChatMessages);

module.exports = router;
