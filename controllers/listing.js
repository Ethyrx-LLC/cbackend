require("dotenv").config();
const Listings = require("../models/listing");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Category = require("../models/category");
const Comments = require("../models/comments");
const KEY = process.env.TOKEN_SECRET;
// Returns an array of listings
exports.display_listings_all = asyncHandler(async (req, res, next) => {
  const listings = await Listings.find().populate("user").exec();
  res.json({ success: true, listings: listings });
});

// Returns a specific listing based on ID
exports.display_listing_detail = asyncHandler(async (req, res, next) => {
  const listing = await Listings.findById(req.params.id).populate("user").exec();

  if (listing === null) {
    res.status(404).json("Page not Found");
  } else {
    res.status(200).json({ success: true, listing: listing });
  }
});

exports.create_listing_get = asyncHandler(async (req, res, next) => {
  const categories = Category.find().exec();
  const token = req.token;

  jwt.verify(token, KEY, (err, authData) => {
    if (err) {
      res.status(401).json({ success: false, message: "User not logged in" });
    } else {
      res.status(200).json({ success: true, authData, categories });
    }
  });
});

exports.create_listing_post = [
  body("title", "Title must be more than 3 characters long").trim().isLength({ min: 3 }).escape(),
  body("content", "Content must be more than 10 letters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body("category", "Please select a category").notEmpty(),

  asyncHandler(async (req, res, next) => {
    const token = req.token;
    jwt.verify(token, KEY, async (err, authData) => {
      if (err) {
        res.status(401).json({ success: false, message: "Unauthorized" });
      } else {
      }
      const errors = validationResult(req);

      const listing = new Listings({
        user: authData._id,
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        urgency: req.body.urgency || 0,
      });

      const category = await Category.findById(req.body.category);

      if (!errors.isEmpty()) {
        res.status(401).json({ success: false, error: errors.array() });
      } else {
        await listing.save();
        category.listings.push(listing);
        res.status(200).json({ success: true, listing: listing });
      }
    });
  }),
];

exports.delete_listing_post = asyncHandler(async (req, res, next) => {
  const token = req.token;
  const listing = Listings.findById(req.params.id).exec();

  jwt.verify(token, KEY, async (err, authData) => {
    if (err) {
      res.status(401).json({ success: false, message: "Unauthorized" });
    } else {
      if (listing === null) {
        res.json({ success: false, error: "No post found" });
      } else {
        await listing.deleteOne();
        await Comments.deleteMany({
          listing: listing._id,
        });
        res.json({ success: true, error: "Post deleted" });
      }
    }
  });
});

exports.upvote_listing_post = asyncHandler(async (req, res, next) => {
  const token = req.token;
  const listing = await Listings.findById(req.params.id).exec();
  jwt.verify(token, KEY, async (err, authData) => {
    if (err) {
      res.status(401).json({ success: false, message: "Unauthorized" });
    } else {
      if (listing === null) {
        res.status(403).json({ success: false, error: "No post found" });
      } else {
        listing.likes += 1;
        await listing.save();
        res.status(200).json({ success: true, likes: listing.likes });
      }
    }
  });
});
