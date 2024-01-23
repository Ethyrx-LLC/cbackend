require("dotenv").config();
const asyncHandler = require("express-async-handler");
const Categories = require("../models/category");

exports.list_categories_get = asyncHandler(async (req, res, next) => {
  const categories = await Categories.find().populate("listings").exec();

  res.status(200).json({ user: req.user, success: true, categories: categories });
});

exports.category_detail_get = asyncHandler(async (req, res, next) => {
  const category = await Categories.findOne(req.params.id).populate("listings").exec();

  res.status(200).json({ user: req.user, success: true, category: category });
});

exports.category_add_post = asyncHandler(async (req, res, next) => {
  const category = new Categories({
    title: req.body.title,
  });

  await category.save();
  res.status(200).json({ user: req.user, success: true, category: category });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const categories = await Categories.find().populate("listings").exec();
  await Categories.findByIdAndDelete(req.body.id);
  res.status(200).json({ user: req.user, success: true, categories: categories });
});
