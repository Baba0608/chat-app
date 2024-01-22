const express = require("express");

const authorization = require("../middleware/auth");
const groupControllers = require("../controllers/group");

const router = express.Router();

router.post("/create_group", authorization, groupControllers.createGroup);

router.get("/groups", authorization, groupControllers.getGroups);

router.get(
  "/group_members/:group_id",
  authorization,
  groupControllers.getGroupMembers
);

router.get("/messages/:group_id", groupControllers.getMessages);

router.post(
  "/send_message/:group_id",
  authorization,
  groupControllers.postMessage
);

router.delete(
  "/remove_participant/:user_id/:group_id",
  groupControllers.removeParticipant
);

router.post("/add_participants/:group_id", groupControllers.addParticipants);

router.patch("/update_admin/:user_id/:group_id", groupControllers.updateAdmin);

router.delete("/exit_group/:user_id/:group_id", groupControllers.exitGroup);

module.exports = router;
