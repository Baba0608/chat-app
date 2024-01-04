const Users = require("../models/users");
const Privatefriend = require("../models/private-friend");

const uuid = require("uuid");

const exists = (email, number) => {
  if (email) {
    return Users.findOne({
      where: {
        email: email,
      },
    });
  } else {
    return Users.findOne({
      where: {
        mobilenumber: number,
      },
    });
  }
};

const userSignup = (req, hash) => {
  const { userName, email, mobileNumber } = req.body;
  return Users.create({
    username: userName,
    email: email,
    mobilenumber: mobileNumber,
    password: hash,
    socketId: null,
  });
};

const createPrivateFriend = (userId, friendId, friendName) => {
  const uniqueId = uuid.v4();
  return Privatefriend.bulkCreate([
    {
      userId: userId,
      friendId: friendId,
      friendname: friendName,
      privateId: uniqueId,
    },
    {
      userId: friendId,
      friendId: userId,
      friendname: "",
      privateId: uniqueId,
    },
  ]);
};

const updateSocketId = (userId, socketId) => {
  return Users.update(
    { socketId: socketId },
    {
      where: {
        id: userId,
      },
    }
  );
};

const getUser = (id) => {
  return Users.findOne({
    where: {
      id: id,
    },
  });
};

exports.userSignup = userSignup;
exports.exists = exists;
exports.createPrivateFriend = createPrivateFriend;
exports.updateSocketId = updateSocketId;
exports.getUser = getUser;
