require("dotenv").config();
const Comments = require("../models/comments");
const asyncHandler = require("express-async-handler");
const Listings = require("../models/listing");
const User = require("../models/user");

exports.list_comments_get = asyncHandler(async (req, res, next) => {
  const comments = await Comments.find().populate("user").exec();

  res.status(200).json({ success: true, comments: comments, authData });
});

exports.create_comment_post = asyncHandler(async (req, res, next) => {
  const user = await User.findById(auth._id).exec();
  const listing = await Listings.findById(req.params.id).populate("user").exec();
  const comment = new Comments({
    user: auth._id,
    listing: req.params.id,
    text: req.body.comment,
    likes: 0,
    dislikes: 0,
  });
  await comment.save();
  listing.comments.push(comment);
  user.comments.push(comment);
  await post.save();
  await user.save();
  res.status(200).json({ success: true, message: "Posted", authData });
});

exports.delete_comment_post = asyncHandler(async (req, res, next) => {
  await Comments.findOneAndDelete({ comments: req.body.comment }).exec();

  res.status(200).json({ success: true, message: "Deleted", authData });
});

exports.upvote_comment_post = asyncHandler(async (req, res, next) => {
  const comment = Comments.findById(req.params.id).exec();
  const listing = await Listings.findById(req.params.id).populate("user").exec();
  if (listing === null) {
    res.json({ success: false, error: "No post found" });
  } else {
    comment.likes += 1;
    await comment.save();
    res.json({ success: true, likes: comment.likes, authData });
  }
});

exports.downvote_comment_post = asyncHandler(async (req, res, next) => {
  const comment = Comments.findById(req.params.id).exec();
  const listing = Listings.findById(req.params.id).exec();

  if (listing === null) {
    res.status(403).json({ success: false, error: "No post found" });
  } else {
    comment.dislikes += 1;
    await comment.save();
    res.status(200).json({ success: true, likes: comment.dislikes, authData });
  }
});
