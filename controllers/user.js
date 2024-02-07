// Import necessary modules and models
require("dotenv").config();
const User = require("../models/user");
const emoji = require("node-emoji");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ROLE } = require("../middleware/permissions");

// Get all users with populated listings and comments
exports.users_get = asyncHandler(async (req, res, next) => {
  const users = User.find().populate("listings").populate("comments").exec();

  res.status(200).json({ users: users });
});

// Get a specific user with populated listings and comments based on ID
exports.user_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("listings").populate("comments").exec();

  res.status(200).json({ user: user });
});

// Create a new user
exports.create_users_post = [
  // Validation for the request body
  body("username", "Username must be more than 1 letter").trim().isLength({ min: 1 }).escape(),
  body("email", "Please use correct email form").trim().isEmail().escape(),
  body("password", "Password must be more than 6 characters").trim().isLength({ min: 6 }).escape(),
  body("confirm_password", "Passwords are not matching")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),

  // Process the creation of a new user
  asyncHandler(async (req, res, next) => {
    // Check if the user already exists
    const userExist = await User.findOne({ email: req.body.email }).exec();

    if (userExist === null) {
      // Validate request body
      const errors = validationResult(req);

      // Hash the password
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // Create a new user
        const user = new User({
          username: req.body.username,
          email: req.body.email,
          perms: ROLE.BASIC,
          password: hashedPassword,
          admin: false,
        });

        // Check for validation errors
        if (!errors.isEmpty()) {
          res.status(401).json({ error: errors.array() });
        } else {
          // Save the new user
          await user.save();
        }
      });
    } else {
      res.status(401).json({ message: "User already exists" });
      console.log(userExist);
    }
  }),
];

// Process user login
exports.login_post = [
  // Validation for the request body
  body("username", "User name must be more than 3 letters").trim().isLength({ min: 3 }).escape(),
  body("password", "Password must be more than 3 letter").trim().isLength({ min: 3 }).escape(),
  asyncHandler(async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      res.status(403).json({ error: errors.array() });
    } else {
      // Authenticate the user using passport
      passport.authenticate(
        "local",
        { successRedirect: "/cookie" },
        (err, user, failureDetails) => {
          if (err) {
            res.status(500).json({ message: "Something went wrong authenticating user" });
            return;
          }

          if (!user) {
            res.status(401).json(failureDetails);
            return;
          }

          // Save user in session
          req.login(user, (err) => {
            if (err) {
              res.status(500).json({ message: "Session save went bad." });
              return;
            }

            console.log("---123456789098765432345678---", req.user);

            res.status(200).json({ errors: false, user: user });
          });
        }
      )(req, res, next);
    }
  }),
];

// Process user logout
exports.logout_post = (req, res, next) => {
  res.status(200).clearCookie("connect.sid").json({ message: "Logged out" });
};

// Set emoji for a user
exports.emoji_set = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  const userEmoji = emoji.unemojify(req.body.emoji);
  user.emoji = userEmoji;
  await user.save();
  res.status(200).json({ user_emoji: req.user.emoji });
});

// Get user details using a cookie
exports.cookie = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user).populate("listings").populate("comments").exec();
  res.status(200).json(user);
});
