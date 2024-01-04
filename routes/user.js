const express = require("express");

const authorization = require("../middleware/auth");
const userControllers = require("../controllers/user");

const router = express.Router();

router.post("/signup", userControllers.signup);

router.post("/login", userControllers.login);

router.post("/createnewchat", authorization, userControllers.createNewChat);

router.post("/updatesocketid", authorization, userControllers.updateSocketId);

router.get("/getsocketid/:friendid", userControllers.getSocketId);

module.exports = router;
