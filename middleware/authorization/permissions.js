// Load environment variables from a .env file
require("dotenv").config()

// Import necessary modules and models
const asyncHandler = require("express-async-handler")
const { ROLE } = require("./roles") // Assuming "./roles" is the correct path to your roles module
const Listing = require("../../models/listing") // Assuming the correct path to your Listing model

// Middleware function to check authorization before deleting a listing
exports.deleteListingCheck = asyncHandler(async (req, res, next) => {
    // Find the listing by ID from the request parameters
    const listing = await Listing.findById(req.params.id).exec()

    // Check if the user is authorized based on their role and the listing's user
    if (
        listing.user !== req.user && // Check if the listing's user is not the same as the request user
        req.user.perms !== ROLE.MOD && // Check if the user role is not MOD
        req.user.perms !== ROLE.ADMIN // Check if the user role is not ADMIN
    ) {
        // If not authorized, respond with a 401 Unauthorized status and a message
        res.status(401).json("You are not authorized")
    } else {
        // If authorized, respond with a 200 OK status and a message
        res.status(200).json("You are authorized")
        // Call the next middleware in the stack
        return next()
    }
})

// Middleware function to check if the user has the MOD role
exports.MOD = asyncHandler(async (req, res) => {
    // Check if the user role is not MOD
    if (req.user.perms !== ROLE.MOD) {
        // If not authorized, respond with a 401 Unauthorized status and a message
        res.status(401).json("You are not authorized")
    } else {
        // If authorized, respond with a 200 OK status and a message
        res.status(200).json("You are authorized")
    }
})

// Middleware function to check if the user has the ADMIN role
exports.ADMIN = asyncHandler(async (req, res) => {
    // Check if the user role is not ADMIN
    if (req.user.perms !== ROLE.ADMIN) {
        // If not authorized, respond with a 401 Unauthorized status and a message
        res.status(401).json("You are not authorized")
    } else {
        // If authorized, respond with a 200 OK status and a message
        res.status(200).json("You are authorized")
    }
})
