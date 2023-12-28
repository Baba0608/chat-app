const bcrypt = require("bcrypt");

const UserServices = require("../services/users");

const signup = async (req, res, next) => {
  try {
    const { password } = req.body;
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        throw new Error("Something went wrong.");
      }

      // calling user services to save details to database.
      const result = await UserServices.userSignup(req, hash);

      return res.status(200).json({
        success: true,
        message: "User successfully signed-up.",
        result,
      });
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

exports.signup = signup;
