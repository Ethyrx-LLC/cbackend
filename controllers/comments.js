require("dotenv").config();
const Comments = require("../models/comment");
const Posts = require("../models/post");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const KEY = process.env.TOKEN_SECRET;
exports.list_comments_get = asyncHandler(async (req, res, next) => {
  const comments = await Comments.find().populate("user").exec();

  res.status(200).json({ success: true, comments: comments });
});

exports.create_comment_post = asyncHandler(async (req, res, next) => {
  const token = req.token;
  const post = await Posts.findById(req.params.id);
  jwt.verify(token, KEY, async (err, auth) => {
    if (err) {
      res.status(403).json({ success: false, message: "Please login to post" });
    } else {
      const comment = new Comments({
        user: auth,
        listing: req.params.id,
        text: req.body.comment,
        likes: 0,
        dislikes: 0,
      });
      await comment.save();
      post.comments.push(comment);
      await post.save();
      res.status(200).json({ success: true, message: "Posted" });
    }
  });
});

exports.delete_comment_post = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, KEY, (err, auth) => {
    if (err) {
      res.status(403).json({ success: false, message: "Please login to delete" });
    } else {
      Comments.findOneAndDelete({ comments: req.body.comment }).exec();

      res.status(200).json({ success: true, message: "Deleted" });
    }
  });
});

exports.upvote_comment_post;
