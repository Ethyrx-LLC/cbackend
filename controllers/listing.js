// Import necessary modules and models
require("dotenv").config()
const Listings = require("../models/listing")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")
const Category = require("../models/category")
const Comments = require("../models/comments")
const User = require("../models/user")
const mongoose = require("mongoose")

// Returns an array of listings with populated user and comments data
exports.display_listings_all = asyncHandler(async (req, res) => {
    let categoryQuery = {}
    const categoryId = String(req.query.category || "")

    // If categoryId is provided, validate it
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid query. Retrying will not help.",
        })
    }

    if (categoryId) {
        categoryQuery = { category: categoryId }
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const startIndex = (page - 1) * limit

    const total = await Listings.countDocuments()
    const pages = Math.ceil(total / limit)
    const max = page >= pages
    // Fetch listings with user and comments population
    const listings = await Listings.find(categoryQuery)
        .skip(startIndex)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .populate({ path: "user", select: "username emoji" })
        .populate({
            path: "comments",
            select: "user createdAt",
            populate: {
                path: "user",
                select: "username emoji",
            },
        })
        .populate({
            path: "category",
            select: "_id title meta_description",
        })
        .exec()
    // Respond with the populated listings
    res.status(200).json({ user: req.user, success: true, listings, max })
})

// Returns details of a specific listing based on ID
exports.display_listing_detail = asyncHandler(async (req, res) => {
    // Fetch listing by ID with user and comments population
    const listing = await Listings.findById(req.params.id)
        .populate({
            path: "user",
            select: "_id username emoji createdAt last_seen",
        })
        .populate("comments")
        .populate("category")
        .exec()

    // Check if the listing exists
    if (listing === null) {
        res.status(404).json("Page not Found")
    } else {
        // Increment views and save the updated listing
        listing.views += 1
        await listing.save()
        // Respond with the populated listing details
        res.status(200).json({
            user: req.user,
            success: true,
            listing: listing,
        })
    }
})

// Fetch categories for creating a new listing
exports.create_listing_get = asyncHandler(async (req, res) => {
    // Fetch categories
    const categories = Category.find().exec()

    // Respond with categories
    res.status(200).json({ user: req.user, success: true, categories })
})

// Handle the creation of a new listing
exports.create_listing_post = [
    // Validation for the request body
    body("title", "Title must be more than 3 characters long")
        .trim()
        .isLength({ min: 3, max: 60 }),
    body("content", "Content must be more than 10 letters long")
        .trim()
        .isLength({ min: 10 }),
    body("category", "Please select a category").notEmpty(),

    // Process the creation of a new listing
    asyncHandler(async (req, res) => {
        // Validate request body
        const errors = validationResult(req)

        // Fetch the user who is creating the listing
        const poster = await User.findById(req.user._id).exec()

        // Fetch the category based on the title provided in the request body
        const category = await Category.findById(req.body.category)

        console.log(category)

        // Create a new listing object
        const listing = new Listings({
            user: req.user._id,
            title: req.body.title,
            content: req.body.content,
            category: category,
            location: req.userLocation,
            photos: req.files,
            likes: 0,
            views: 0,
            urgency: req.body.urgency || 0,
            createdAt: new Date(),
        })

        // Check for validation errors
        if (!errors.isEmpty()) {
            res.status(401).json({ success: false, error: errors.array() })
        } else {
            // Save the new listing, update poster and category references
            await listing.save()
            poster.listings.push(listing)
            category.listings.push(listing)
            await category.save()
            await poster.save()
            // Respond with success and the created listing
            res.status(200).json({
                success: true,
                listing: listing,
            })
        }
    }),
]

// Handle the deletion of a listing
exports.delete_listing_post = asyncHandler(async (req, res) => {
    // Fetch the listing to be deleted
    const listing = await Listings.findById(req.params.id).exec()

    // Check if the listing exists
    if (listing === null) {
        res.json({ success: false, error: "No post found" })
    } else {
        // Delete the listing and associated comments
        await Listings.findByIdAndDelete(req.params.id).exec()
        await Comments.deleteMany({
            listing: listing._id,
        }).exec()
        // Respond with success
        res.json({ success: true, error: "Post deleted" })
    }
})

// Handle the upvoting of a listing
exports.upvote_listing_post = asyncHandler(async (req, res) => {
    // Fetch the listing and user
    const listing = await Listings.findById(req.params.id).exec()
    const user = await User.findById(req.user).exec()

    // Check if the listing exists
    if (listing === null) {
        res.status(403).json({ success: false, error: "No post found" })
    } else if (user === null) {
        res.status(403).json({
            success: false,
            error: "Must be logged in to vote",
        })
    }

    // Check if the user has already upvoted the listing
    for (let listingLikes of user.listing_likes) {
        if (listingLikes._id.equals(listing._id)) {
            const found = user.listing_likes.findIndex((cm) =>
                cm._id.equals(listing._id)
            )
            user.listing_likes.splice(found, 1)
            listing.likes -= 1
            await user.save()
            await listing.save()
            // Respond with success and updated like information
            return res.json({
                success: true,
                likes: listing.likes,
                user_likes: user.listing_likes,
            })
        }
    }

    // If user hasn't upvoted, add the upvote
    user.listing_likes.push(listing)
    listing.likes += 1
    await listing.save()
    await user.save()
    // Respond with success and updated like information
    res.status(200).json({
        success: true,
        likes: listing.likes,
        user_likes: user.listing_likes,
    })
})

// Handle the increase in views for a listing
exports.views_increase_listing_post = asyncHandler(async (req, res) => {
    // Fetch the listing
    const listing = await Listings.findById(req.params.id).exec()

    // Check if the listing exists
    if (listing === null) {
        res.status(403).json({ success: false, error: "No post found" })
    } else {
        // Increment views and save the updated listing
        listing.views += 1
        await listing.save()
        // Respond with success and updated view count
        res.status(200).json({ success: true, likes: listing.likes })
    }
})
