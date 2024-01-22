require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const KEY = process.env.TOKEN_SECRET;

exports.users_get = asyncHandler(async (req, res, next) => {
  const token = req.token;
  const users = User.find().populate("listings").populate("comments").exec();
  jwt.verify(token, KEY, (err, authData) => {
    if (err) {
      res.status(200).json({ users: users, authData: false });
    } else {
      send.status(200).json({ users: users, authData });
    }
  });
});

exports.user_get = asyncHandler(async (req, res, next) => {
  const token = req.token;
  const user = User.findById(req.params.id).populate("listings").populate("comments").exec();
  jwt.verify(token, KEY, (err, authData) => {
    if (err) {
      send.status(200).json({ user: user, authData: false });
    } else {
      send.status(200).json({ user: user, authData });
    }
  });
});

exports.create_users_post = [
  body("username", "Username must be more than 1 letter").trim().isLength({ min: 1 }).escape(),
  body("email", "Please use correct email form").trim().isEmail().escape(),
  body("password", "Password must be more than 6 characters").trim().isLength({ min: 6 }).escape(),
  body("confirm_password", "Passwords are not matching")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),

  asyncHandler(async (req, res, next) => {
    const userExist = await User.findOne({ email: req.body.email }).exec();

    if (userExist === null) {
      console.log("null");
      const errors = validationResult(req);
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        const user = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          admin: false,
        });

        if (!errors.isEmpty()) {
          res.status(401).json({ error: errors.array() });
        } else {
          await user.save();
        }
      });
    } else {
      res.status(401).json({ message: "User already exists" });
      console.log(userExist);
    }
  }),
];

exports.login_post = [
  body("username", "Please enter correct username").trim().escape(),
  body("password", "Password must be more than 6 characters").trim().isLength({ min: 6 }).escape(),

  asyncHandler(async (req, res, next) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(403).res.json({ error: errors.array() });
    }
    const user = await User.findOne({
      username: req.body.username,
    });
    const match = await bcrypt.compare(req.body.password, user.password);

    const accessToken = jwt.sign(JSON.stringify(user), KEY);

    if (match) {
      res
        .status(200)
        .cookie("token", accessToken, {
          httpOnly: true,
          expires: expirationDate,
          sameSite: "None",
        })
        .json({ message: "User Logged in", user: user });
    } else {
      res.status("403").json("Please enter correct credentials");
    }
  }),
];

exports.logout_post = (req, res, next) => {
  res.status(200).clearCookie("token").json({ message: "Logged out" });
};
