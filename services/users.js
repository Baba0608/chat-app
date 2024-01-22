const User = require("../models/users");
const PrivateFriend = require("../models/private-friend");

const uuid = require("uuid");

const exists = (email, number) => {
  if (email) {
    return User.findOne({
      where: {
        email: email,
      },
    });
  } else {
    return User.findOne({
      where: {
        mobilenumber: number,
      },
    });
  }
};

const userSignup = (req, hash) => {
  const { userName, email, mobileNumber } = req.body;
  return User.create({
    username: userName,
    email: email,
    mobilenumber: mobileNumber,
    password: hash,
    socketId: null,
  });
};

const createPrivateFriend = (userId, friendId, friendName) => {
  const uniqueId = uuid.v4();
  return PrivateFriend.bulkCreate([
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
  return User.update(
    { socketId: socketId },
    {
      where: {
        id: userId,
      },
    }
  );
};

const getUser = (id) => {
  return User.findOne({
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
