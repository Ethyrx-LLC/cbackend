const Listings = require("../models/listing");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// Returns an array of listings
exports.display_listings_all = asyncHandler(async (req, res, next) => {
  const listings = await Listings.find().populate("user").exec();
  res.json(listings);
});

// Returns a specific listing based on ID
exports.display_listing_detail = asyncHandler(async (req, res, next) => {
  const listing = await Listings.findById(req.params.id)
    .populate("user")
    .exec();

  if (listing === null) {
    res.status(404).json("Page not Found");
  } else {
    res.json(listing);
  }
});

exports.create_listing_get = (req, res, next) => {};

exports.create_listing_post = [
  body("title", "Title must be more than 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("content", "Content must be more than 10 letters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body("category", "Please select a category").notEmpty(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const listing = new Listings({
      user: authData.user.username,
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      urgency: req.body.urgency || 0,
    });

    if (!errors.isEmpty()) {
      res.status(401).json({ success: false, error: errors.array() });
    } else {
      listing.save();
      res.status(200).json({ success: true });
    }
  }),
];

exports.delete_listing_post = asyncHandler(async (req, res, next) => {
  const listing = await Listings.findById(req.params.id).exec();

  if (listing === null) {
    res.json({ success: false, error: "No post found" });
  } else {
    await listing.deleteOne();
    res.json({ success: true, error: "Post deleted" });
  }
});

exports.upvote_listing_post = asyncHandler(async (req, res, next) => {
  const listing = await Listings.findById(req.params.id);

  if (listing === null) {
    res.json({ success: false, error: "No post found" });
  } else {
    listing.likes += 1;
    listing.save();
    res.json({ success: true, likes: listing.likes });
  }
});
