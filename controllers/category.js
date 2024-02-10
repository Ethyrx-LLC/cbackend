// Import necessary modules and models
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const Categories = require("../models/category");

// Get all categories with populated listings
exports.list_categories_get = asyncHandler(async (req, res, next) => {
  // Fetch categories with populated listings
  const categories = await Categories.find().lean().populate("listings").exec();

  // Respond with the categories
  res.status(200).json({ success: true, categories: categories });
});

// Get details of a specific category based on ID with populated listings
exports.category_detail_get = asyncHandler(async (req, res, next) => {
  // Fetch a specific category with populated listings based on ID
  const category = await Categories.findOne(req.params.id).populate("listings").exec();

  // Respond with the category details
  res.status(200).json({ success: true, category: category });
});

// Add a new category
exports.category_add_post = asyncHandler(async (req, res, next) => {
  // Create a new category
  const category = new Categories({
    user: req.variableName._id, // Replace "variableName" with the actual variable name
    title: req.body.title,
  });

  // Save the new category
  await category.save();

  // Respond with success and the created category
  res.status(200).json({ success: true, category: category });
});

// Delete a category based on ID
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // Fetch all categories with populated listings
  const categories = await Categories.find().populate("listings").exec();

  // Find and delete the specified category
  await Categories.findByIdAndDelete(req.body.id);

  // Respond with success and the updated list of categories
  res.status(200).json({ success: true, categories: categories });
});
