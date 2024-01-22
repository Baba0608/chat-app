const GroupServices = require("../services/groups");
const sequelize = require("../utils/database");

const createGroup = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const { groupName, SELECTED_USERS } = req.body;

    const group = await GroupServices.createGroup(groupName, {
      transaction: t,
    });

    const groupId = group.id;

    const users = [
      { userId: req.user.dataValues.id, groupId: groupId, admin: true },
    ];

    const userIds = Object.keys(SELECTED_USERS);
    userIds.forEach((id) => {
      users.push({ userId: +id, groupId: groupId, admin: false });
    });

    const result = await GroupServices.addGroupMembers(users, {
      transaction: t,
    });

    await t.commit();
    return res.status(201).json({ success: true, message: "group created" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const getGroups = async (req, res, next) => {
  try {
    const userId = req.user.dataValues.id;

    const result = await GroupServices.getGroups(userId);

    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const getGroupMembers = async (req, res, next) => {
  try {
    const id = req.user.dataValues.id;
    const groupId = req.params.group_id;
    const result = await GroupServices.getGroupMembers(groupId, id);
    const admin = await GroupServices.isAdmin(groupId, id);
    return res.status(200).json({ success: true, result, admin });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const getMessages = async (req, res, next) => {
  try {
    const groupId = req.params.group_id;

    const result = await GroupServices.getMessages(groupId);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const postMessage = async (req, res, next) => {
  try {
    const userId = req.user.dataValues.id;
    const groupId = req.params.group_id;
    const { message } = req.body;
    const result = await GroupServices.postMessage(message, groupId, userId);
    return res.status(201).json({ success: true, result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const removeParticipant = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const groupId = req.params.group_id;
    const result = await GroupServices.removeParticipant(userId, groupId);
    return res
      .status(200)
      .json({ success: true, message: "User removed from group." });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: true, message: "Something went wrong." });
  }
};

const addParticipants = async (req, res, next) => {
  try {
    const { SELECTED_PARTICIPANTS } = req.body;
    const groupId = req.params.group_id;
    const users = [];
    const userIds = Object.keys(SELECTED_PARTICIPANTS);
    userIds.forEach((id) => {
      users.push({ userId: +id, groupId: groupId, admin: false });
    });

    const result = await GroupServices.addGroupMembers(users);
    return res.status(201).json({ success: true, result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const { admin } = req.body;
    const userId = req.params.user_id;
    const groupId = req.params.group_id;

    await GroupServices.updateAdmin(userId, groupId, admin);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: true, message: "Something went wrong." });
  }
};

const exitGroup = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const groupId = req.params.group_id;

    // get count of the group
    const count = await GroupServices.getGroupCount(groupId);
    if (count === 1) {
      await GroupServices.removeParticipant(userId, groupId);
      await GroupServices.removeGroup(groupId);
      return res
        .status(200)
        .json({ success: true, message: "Exited from the group" });
    } else {
      // get admin count

      const adminCount = await GroupServices.getAdminCount(groupId);
      if (adminCount === 1) {
        // delete groupMember
        await GroupServices.removeParticipant(userId, groupId);
        // make another participant as admin
        const newAdmin = await GroupServices.findParticipant(groupId);
        await GroupServices.updateAdmin(newAdmin.userId, groupId, true);
        return res
          .status(200)
          .json({ success: true, message: "Exited from the group" });
      } else {
        // delete groupMember
        await GroupServices.removeParticipant(userId, groupId);
        return res
          .status(200)
          .json({ success: true, message: "Exited from the group" });
      }
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

exports.exitGroup = exitGroup;
exports.updateAdmin = updateAdmin;
exports.addParticipants = addParticipants;
exports.createGroup = createGroup;
exports.getGroups = getGroups;
exports.getGroupMembers = getGroupMembers;
exports.getMessages = getMessages;
exports.postMessage = postMessage;
exports.removeParticipant = removeParticipant;
