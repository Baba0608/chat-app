const express = require("express");

const authorization = require("../middleware/auth");
const chatControllers = require("../controllers/chat");

const router = express.Router();

router.post("/sendmessage", authorization, chatControllers.sendMessage);

router.get("/getmessages", authorization, chatControllers.getMessages);

module.exports = router;
