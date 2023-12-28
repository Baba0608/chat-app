const Users = require("../models/users");

const userSignup = (req, hash) => {
  const { userName, email, mobileNumber } = req.body;
  return Users.create({
    username: userName,
    email: email,
    mobilenumber: mobileNumber,
    password: hash,
  });
};

exports.userSignup = userSignup;
