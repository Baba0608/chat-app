const express = require("express");

const userControllers = require("../controllers/user");

const router = express.Router();

router.post("/signup", userControllers.signup);

router.post("/login", userControllers.login);

module.exports = router;
