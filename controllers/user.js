require("dotenv").config();
const User = require("../models/user");
const emoji = require("node-emoji");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

exports.users_get = asyncHandler(async (req, res, next) => {
  const users = User.find().populate("listings").populate("comments").exec();

  res.status(200).json({ user: req.user, users: users });
});

exports.user_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("listings").populate("comments").exec();

  res.status(200).json({ user: req.user, user: user });
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
  body("username", "username").trim().isLength({ min: 3 }).escape(),
  body("password", "username").trim().isLength({ min: 3 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body.username);
    if (!errors.isEmpty()) {
      res.status(403).json({ user: user, error: errors.array() });
    } else {
      return passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
        failureMessage: true,
      })(req, res, next);
    }
  }),
];

exports.logout_post = (req, res, next) => {
  res.status(200).clearCookie("token").json({ message: "Logged out" });
};

exports.emoji_set = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("listings").populate("comments").exec();

  const userEmoji = emoji.unemojify(req.body.emoji);
  user.emoji = userEmoji;

  res.status(200);
  res.json({ authData });

  await user.save();
});
