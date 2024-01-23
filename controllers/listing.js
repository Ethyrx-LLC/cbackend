require("dotenv").config();
const Listings = require("../models/listing");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Category = require("../models/category");
const Comments = require("../models/comments");
const User = require("../models/user");

// Returns an array of listings
exports.display_listings_all = asyncHandler(async (req, res, next) => {
  const listings = await Listings.find().populate("user").exec();

  res.status(200).json({ user: req.user, success: true, listings });
});

// Returns a specific listing based on ID
exports.display_listing_detail = asyncHandler(async (req, res, next) => {
  const listing = await Listings.findById(req.params.id).populate("user").exec();

  if (listing === null) {
    res.status(404).json("Page not Found");
  } else {
    res.status(200).json({ user: req.user, success: true, listing: listing });
  }
});

exports.create_listing_get = asyncHandler(async (req, res, next) => {
  const categories = Category.find().exec();

  res.status(200).json({ user: req.user, success: true, categories });
});

exports.create_listing_post = [
  body("title", "Title must be more than 3 characters long").trim().isLength({ min: 3 }).escape(),
  body("content", "Content must be more than 10 letters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body("category", "Please select a category").notEmpty(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const poster = await User.findById(authData._id).exec();
    console.log(poster);
    const category = await Category.findOne({ title: req.body.category });
    console.log(category);
    const listing = new Listings({
      user: authData._id,
      title: req.body.title,
      content: req.body.content,
      category: category._id,
      likes: 0,
      views: 0,
      urgency: req.body.urgency || 0,
      createdAt: new Date(),
    });

    // The line below would not accept category as string.
    //const category = await Category.findById(req.body.category);

    if (!errors.isEmpty()) {
      res.status(401).json({ user: req.user, success: false, error: errors.array() });
    } else {
      await listing.save();
      poster.listings.push(listing);
      category.listings.push(listing);
      await category.save();
      await poster.save();
      res.status(200).json({ user: req.user, success: true, listing: listing });
    }
  }),
];

exports.delete_listing_post = asyncHandler(async (req, res, next) => {
  const listing = Listings.findById(req.params.id).exec();

  if (listing === null) {
    res.json({ user: req.user, success: false, error: "No post found" });
  } else {
    await listing.deleteOne();
    await Comments.deleteMany({
      listing: listing._id,
    });
    res.json({ user: req.user, success: true, error: "Post deleted", authData });
  }
});

exports.upvote_listing_post = asyncHandler(async (req, res, next) => {
  const listing = await Listings.findById(req.params.id).exec();

  if (listing === null) {
    res.status(403).json({ user: req.user, success: false, error: "No post found" });
  } else {
    listing.likes += 1;
    await listing.save();
    res.status(200).json({ user: req.user, success: true, likes: listing.likes, authData });
  }
});

exports.views_increase_listing_post = asyncHandler(async (req, res, next) => {
  const listing = await Listings.findById(req.params.id).exec();

  if (listing === null) {
    res.status(403).json({ user: req.user, success: false, error: "No post found" });
  } else {
    listing.views += 1;
    await listing.save();
    res.status(200).json({ user: req.user, success: true, likes: listing.likes, authData });
  }
});
