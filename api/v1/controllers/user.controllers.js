const User = require("../models/user.model");
const md5 = require("md5");
const generateHelpers = require("../../../helpers/generate");
const ForgotPassword = require("../models/forgot-password.model");
const sendMailHelper = require("../../../helpers/sendMail");


module.exports.register = async (req, res) => {
  const { email, fullName, password } = req.body;
  const existEmail = await User.findOne({
    email: email,
  });

  if (existEmail) {
    res.json({
      code: 400,
      message: "Existed Email",
    });
    return;
  }
  const objectUser = {
    fullName: fullName,
    email: email,
    password: md5(toString(password)),
  };

  const user = new User(objectUser);
  await user.save();

  res.cookie("token", user.token);

  res.json({
    code: 200,
    message: "Register Success!",
  });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Email Incorrect",
    });
    return;
  }
  if(user.password !== md5(toString(password))) {
    res.json({
      code: 400,
      message: "Password Incorrect",
    });
    return;
  }

  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "Login Success !",
    token: token,
  });
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Email Incorrect",
    });
    return;
  }

  const otp = generateHelpers.generateRandomNumber(6);

  const timeExpire = 3;

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + timeExpire * 60 * 1000,
  };

  const newForgotPassword = new forgotPassword(objectForgotPassword);
  await newForgotPassword.save();

  const subject = `Code OTP to reset password. You should'n leak outside`;

  const html = `OTP <strong>${otp}</strong>`;

  sendMailHelper.sendMail(email, subject, html);

  res.json({
    code: 200,
    message: "Sent OTP",
  });
};

module.exports.otp = async (req, res) => {
  const { email, otp } = req.body;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    res.json({
      code: 400,
      message: "OTP Invalid !",
    });
  }

  const user = await User.findOne({
    email: email,
  });
  res.cookie("token", user.token);

  res.json({
    code: 200,
    token: user.token,
  });
};

module.exports.reset = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.cookies.token;
    await User.updateOne(
      {
        token: token,
      },
      {
        password: password,
      }
    );
    res.json({
      code: 200,
      message: "Reset Password Success !",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Reset Password InSuccess !",
      error: error,
    });
  }

  res.json({
    code: 200,
  });
};

module.exports.detail = async (req, res) => {
  try {
    const user = res.user;
    console.log(user)

    res.json({
      code: 200,
      user: user,
    });
  } catch (error) {
    res.json({
        code: 400,
        message: "Token Invalid! ",
        error: error
    })

  }
};

module.exports.list = async (req, res) => {
  try {
    const users = await User.find({
      deleted: false
    }).select("fullName id");
    res.json({
      code: 200,
      users: users
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error
    })
  }
}