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
    const groupId = req.params.groupid;
    const result = await GroupServices.getGroupMembers(groupId, id);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const getMessages = async (req, res, next) => {
  try {
    const groupId = req.params.groupid;

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
    const groupId = req.params.groupid;
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

exports.createGroup = createGroup;
exports.getGroups = getGroups;
exports.getGroupMembers = getGroupMembers;
exports.getMessages = getMessages;
exports.postMessage = postMessage;
