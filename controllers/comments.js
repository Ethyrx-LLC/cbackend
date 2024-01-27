require("dotenv").config();
const Comments = require("../models/comments");
const asyncHandler = require("express-async-handler");
const Listings = require("../models/listing");
const User = require("../models/user");

exports.list_comments_get = asyncHandler(async (req, res, next) => {
  const comments = await Comments.find()
    .populate({ path: "user", select: "username emoji" })
    .populate({ path: "listing", select: "_id" })
    .exec();
  let commentsInListing = [];
  for (let comment of comments) {
    if (comment.listing.id === req.params.id) commentsInListing.push(comment);
  }
  res.status(200).json({ success: true, comments: commentsInListing });
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
  const user = await User.findById(req.user).exec();

  if (comment === null) {
    res.json({ success: false, error: "No post found" });
  }

  for (let userLikes of user.comment_likes) {
    if (userLikes._id.equals(comment._id)) {
      const found = user.comment_likes.findIndex((cm) => cm._id.equals(comment._id));
      user.comment_likes.splice(found, 1);
      comment.likes -= 1;
      await user.save();
      await comment.save();
      return res.json({ success: true, likes: comment.likes, user_likes: user.comment_likes });
    }
  }
  comment.likes += 1;
  user.comment_likes.push(comment);
  await comment.save();
  await user.save();
  res.json({ success: true, likes: comment.likes, user_likes: user.comment_likes });
});

exports.downvote_comment_post = asyncHandler(async (req, res, next) => {
  const comment = await Comments.findById(req.params.id).exec();
  const user = await User.findById(req.user).exec();
  if (comment === null) {
    res.status(403).json({ success: false, error: "No post found" });
  }
  for (let userDislikes of user.comment_dislikes) {
    if (userDislikes._id.equals(comment._id)) {
      const found = user.comment_likes.findIndex((cm) => cm._id.equals(comment._id));
      user.comment_dislikes.splice(found, 1);
      comment.dislikes -= 1;
      await user.save();
      await comment.save();
      return res.json({
        success: true,
        likes: comment.dislikes,
        user_dislikes: user.comment_dislikes,
      });
    }
  }
  comment.dislikes += 1;
  user.comment_dislikes.push(comment);
  await comment.save();
  await user.save();
  res
    .status(200)
    .json({ success: true, likes: comment.dislikes, user_dislikes: user.comment_dislikes });
});
