const Listings = require("../models/listing");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Returns an array of listings
exports.display_listings_all = asyncHandler(async (req, res, next) => {
  const listings = Listings.find().populate("user").exec();
  res.json(listings);
});

// Returns a specific listing based on ID
exports.display_listing_detail = asyncHandler(async (req, res, next) => {
  const listing = Listings.findById(req.params.id).populate("user").exec();

  if (listing === null) {
    res.status(404).json("Page not Found");
  } else {
    res.json(listing);
  }
});
