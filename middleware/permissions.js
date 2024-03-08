require("dotenv").config()
const asyncHandler = require("express-async-handler")
const Listing = require("../models/listing")
const ROLE = {
    ADMIN: 100,
    MOD: 50,
    BASIC: 0,
}

exports.DELETE_LISTING = asyncHandler(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id).exec()
    if (
        listing.user !== req.user &&
        req.user.perms !== ROLE.MOD &&
        req.user.perms !== ROLE.ADMIN
    ) {
        res.status(401).json("You are not authorized")
    } else {
        res.status(200).json("You are authorized")
        next()
    }
})

exports.MOD = asyncHandler(async (req, res) => {
    if (req.user.perms !== ROLE.MOD) {
        res.status(401).json("You are not authorized")
    }
})

exports.ADMIN = asyncHandler(async (req, res) => {
    if (req.user.perms !== ROLE.ADMIN) {
        res.status(401).json("You are not authorized")
    }
})

module.exports = {
    ROLE,
}
