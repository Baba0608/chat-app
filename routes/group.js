const express = require("express");

const authorization = require("../middleware/auth");
const groupControllers = require("../controllers/group");

const router = express.Router();

router.post("/creategroup", authorization, groupControllers.createGroup);

router.get("/getgroups", authorization, groupControllers.getGroups);

router.get(
  "/getgroupmembers/:groupid",
  authorization,
  groupControllers.getGroupMembers
);

router.get("/getmessages/:groupid", groupControllers.getMessages);

router.post(
  "/sendmessage/:groupid",
  authorization,
  groupControllers.postMessage
);

module.exports = router;
