require("dotenv").config;
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const cookie = require("cookie");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.create_users_get = asyncHandler(async (req, res, next) => {
  const user = User.find().populate("posts").exec();
  res.json({ user: user });
});
exports.create_users_post = [
  body("first_name", "First name must be more than 1 letter")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name must be more than 1 letter")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email", "Please use correct email form").trim().isEmail().escape(),
  body("password", "Password must be more than 6 characters")
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body("confirm_password", "Passwords are not matching")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const userObj = { ...req.body.credentials };
    console.log(userObj);
    bcrypt.hash(userObj.password, 10, async (err, hashedPassword) => {
      console.log("this works");
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword,
        admin: false,
      });

      if (!errors.isEmpty()) {
        console.log(errors);
        res.json({ error: errors.array() });
      }
      await user.save();
    });
  }),
];

exports.login_get = (req, res, next) => {
  res.json({});
};

exports.login_post = [
  body("email", "Please use correct email form").trim().isEmail().escape(),
  body("password", "Password must be more than 6 characters")
    .trim()
    .isLength({ min: 6 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(403).res.json({ error: errors.array() });
    }
    const user = await User.findOne({
      email: req.body.email,
    });
    const match = await bcrypt.compare(req.body.password, user.password);
    console.log(match);
    const accessToken = jwt.sign(
      JSON.stringify(user),
      process.env.TOKEN_SECRET
    );
    console.log(match);
    if (match) {
      res
        .status(200)
        .cookie("token", accessToken)
        .json({ message: "User Created" });
    } else {
      res.status("403").json("Please enter correct credentials");
    }
  }),
];
