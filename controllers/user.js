const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserServices = require("../services/users");

const signup = async (req, res, next) => {
  const { password, email } = req.body;

  try {
    const result = await UserServices.exists(email);

    console.log(result);

    if (!result) {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          throw new Error("Something went wrong.");
        }

        // calling user services to save details to database.
        try {
          const result = await UserServices.userSignup(req, hash);
          return res.status(200).json({
            success: true,
            message: "User successfully signed-up.",
            result,
          });
        } catch (err) {
          throw new Error("Something went wrong.");
        }
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User Already Exists." });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

// -----------------------------------------------------------

function generateToken(id, name) {
  return jwt.sign({ userId: id, name: name }, process.env.JWT_SECRET_KEY);
}

// ------------------------------------------------
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserServices.exists(email);
    // console.log(user);
    if (user === null) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    bcrypt.compare(password, user.dataValues.password, (err, result) => {
      if (err) {
        throw new Error("Something went wrong.");
      }

      if (result) {
        return res.status(200).json({
          success: true,
          message: "User logged in successfully.",
          token: generateToken(user.dataValues.id, user.dataValues.username),
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Password is incorrect." });
      }
    });
  } catch (err) {
    // console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

exports.signup = signup;
exports.login = login;
