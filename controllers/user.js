require("dotenv").config();
const User = require("../models/user");
const emoji = require("node-emoji");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

exports.users_get = asyncHandler(async (req, res, next) => {
  const users = User.find().populate("listings").populate("comments").exec();

  res.status(200).json({ users: users });
});

exports.user_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("listings").populate("comments").exec();

  res.status(200).json({ user: user });
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
  body("username", "User name must be more than 3 letters").trim().isLength({ min: 3 }).escape(),
  body("password", "Password must be more than 3 letter").trim().isLength({ min: 3 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body.username);
    if (!errors.isEmpty()) {
      res.status(403).json({ error: errors.array() });
    } else {
      passport.authenticate("local", (err, theUser, failureDetails) => {
        if (err) {
          res.status(500).json({ message: "Something went wrong authenticating user" });
          return;
        }

        if (!theUser) {
          res.status(401).json(failureDetails);
          return;
        }

        // Save user in session
        req.login(theUser, (err) => {
          if (err) {
            res.status(500).json({ message: "Session save went bad." });
            return;
          }

          console.log("---123456789098765432345678---", req.user);
          res.status(200).json({ errors: false, user: theUser });
        });
      })(req, res, next);
    }
  }),
];

exports.logout_post = (req, res, next) => {
  res.status(200).clearCookie("connect.sid").json({ message: "Logged out" });
};

exports.emoji_set = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  const userEmoji = emoji.unemojify(req.body.emoji);
  user.emoji = userEmoji;
  await user.save();
  res.status(200).json({ user_emoji: req.user.emoji });
});

exports.cookie = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user).exec();
  res.status(200).json({ user: user.id });
});
