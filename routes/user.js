const express = require("express");

const authorization = require("../middleware/auth");
const userControllers = require("../controllers/user");

const router = express.Router();

router.post("/signup", userControllers.signup);

router.post("/login", userControllers.login);

router.post("/create_new_chat", authorization, userControllers.createNewChat);

router.post("/update_socket_id", authorization, userControllers.updateSocketId);

router.get("/socket_id/:friend_id", userControllers.getSocketId);

module.exports = router;
