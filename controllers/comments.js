require("dotenv").config();
const Comments = require("../models/comments");
const asyncHandler = require("express-async-handler");
const Listings = require("../models/listing");
const User = require("../models/user");

exports.list_comments_get = asyncHandler(async (req, res, next) => {
  const comments = await Comments.find()
    .populate({ path: "user", select: "username emoji" })
    .exec();

  if (comments.listings._id === req.params.id) {
    res.status(200).json({ success: true, comments: comments });
  }
});

exports.create_comment_post = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user).exec();
  if (req.user === null) {
    return console.log("no user");
  }

  console.log(req.body.comment);
  const listing = await Listings.findById(req.params.id).populate("user").exec();
  const comment = new Comments({
    user: req.user.id,
    listing: req.params.id,
    text: req.body.comment,
    likes: 0,
    dislikes: 0,
  });
  await comment.save();
  listing.comments.push(comment);
  user.comments.push(comment);
  await listing.save();
  await user.save();
  res.status(200).json({ success: true, message: "Posted" });
});

exports.delete_comment_post = asyncHandler(async (req, res, next) => {
  await Comments.findOneAndDelete({ comment: req.body.comment }).exec();

  res.status(200).json({ success: true, message: "Deleted" });
});

exports.upvote_comment_post = asyncHandler(async (req, res, next) => {
  const comment = await Comments.findById(req.params.id).exec();
  console.log(comment);
  if (comment === null) {
    res.json({ success: false, error: "No post found" });
  } else {
    comment.likes += 1;
    await comment.save();
    res.json({ success: true, likes: comment.likes });
  }
});

exports.downvote_comment_post = asyncHandler(async (req, res, next) => {
  const comment = await Comments.findById(req.params.id).exec();

  if (comment === null) {
    res.status(403).json({ success: false, error: "No post found" });
  } else {
    comment.dislikes += 1;
    await comment.save();
    res.status(200).json({ success: true, likes: comment.dislikes });
  }
});
