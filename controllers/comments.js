// Import necessary modules and models
require("dotenv").config()
const Comments = require("../models/comments")
const asyncHandler = require("express-async-handler")
const Alerts = require("../models/alerts")
const Listings = require("../models/listing")
const User = require("../models/user")
// Get comments for a specific listing
exports.list_comments_get = asyncHandler(async (req, res) => {
    // Fetch comments with user and listing population
    const comments = await Comments.find()
        .populate({ path: "user", select: "username emoji" })
        .populate({ path: "listing", select: "_id" })
        .exec()
    console.log(comments)

    // Filter comments based on the provided listing ID
    let commentsInListing = []
    for (let comment of comments) {
        console.log("===========LISTING IDS==========")
        console.log(comment.listing.id)
        console.log("===========PARAMS ID IDS==========")
        console.log(req.params.id)
        if (comment.listing.id === req.params.id)
            console.log("===========MATCHING COMMENTS==========")
        console.log(comment)
        commentsInListing.push(comment)
    }

    // Respond with the filtered comments
    res.status(200).json({ success: true, comments: commentsInListing })
})

// Create a new comment for a listing
exports.create_comment_post = asyncHandler(async (req, res) => {
    // Fetch user and listing based on provided IDs
    const user = await User.findById(req.user).exec()
    if (req.user === null) {
        return console.log("no user")
    }

    const listing = await Listings.findById(req.params.id)
        .populate("user")
        .exec()

    // Create a new comment
    const comment = new Comments({
        user: req.user.id,
        listing: req.params.id,
        text: req.body.comment,
        likes: 0,
        dislikes: 0,
    })

    const alert = new Alerts({
        user_id: listing.user,
        comment: comment,
        listing: comment.listing,
        link: req.params.id,
        is_read: false,
        createdAt: Date.now(),
    })

    // Save the new comment, update references in listing and user

    listing.comments.push(comment)
    user.comments.push(comment)

    await Promise.all([
        comment.save(),
        await alert.save(),
        await listing.save(),
        await user.save(),
    ])
    // Respond with success message
    res.status(200).json({ success: true, message: "Posted" })
})

// Delete a comment
exports.delete_comment_post = asyncHandler(async (req, res) => {
    // Find and delete the specified comment
    await Comments.findByIdAndDelete(req.params.id).exec()

    // Respond with success message
    res.status(200).json({ success: true, message: "Deleted" })
})

// Upvote a comment
exports.upvote_comment_post = asyncHandler(async (req, res) => {
    // Fetch comment and user
    const comment = await Comments.findById(req.params.id).exec()
    const user = await User.findById(req.user).exec()

    // Check if the comment exists
    if (comment === null) {
        res.json({ success: false, error: "No post found" })
    }

    // Check if the user has already upvoted the comment
    for (let userLikes of user.comment_likes) {
        if (userLikes._id.equals(comment._id)) {
            const found = user.comment_likes.findIndex((cm) =>
                cm._id.equals(comment._id)
            )
            user.comment_likes.splice(found, 1)
            comment.likes -= 1
            await user.save()
            await comment.save()
            // Respond with success and updated like information
            return res.json({
                success: true,
                likes: comment.likes,
                user_likes: user.comment_likes,
            })
        }
    }

    // If user hasn't upvoted, add the upvote
    comment.likes += 1
    user.comment_likes.push(comment)
    await comment.save()
    await user.save()
    // Respond with success and updated like information

    res.json({
        success: true,
        likes: comment.likes,
        user_likes: user.comment_likes,
    })
})

// Downvote a comment
exports.downvote_comment_post = asyncHandler(async (req, res) => {
    // Fetch comment and user
    const comment = await Comments.findById(req.params.id).exec()
    const user = await User.findById(req.user).exec()

    // Check if the comment exists
    if (comment === null) {
        res.status(403).json({ success: false, error: "No post found" })
    }

    // Check if the user has already downvoted the comment
    for (let userDislikes of user.comment_dislikes) {
        if (userDislikes._id.equals(comment._id)) {
            const found = user.comment_likes.findIndex((cm) =>
                cm._id.equals(comment._id)
            )
            user.comment_dislikes.splice(found, 1)
            comment.dislikes -= 1
            await user.save()
            await comment.save()

            // Respond with success and updated dislike information
            return res.json({
                success: true,
                likes: comment.dislikes,
                user_dislikes: user.comment_dislikes,
            })
        }
    }

    // If user hasn't downvoted, add the downvote
    comment.dislikes += 1
    user.comment_dislikes.push(comment)
    await comment.save()
    await user.save()
    // Respond with success and updated dislike information
    res.status(200).json({
        success: true,
        likes: comment.dislikes,
        user_dislikes: user.comment_dislikes,
    })
})
