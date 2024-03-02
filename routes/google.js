const passport = require("passport")
const express = require("express")
const router = express.Router()

// GOOGLE REDIRECT
router.get("/", passport.authenticate("google"))
router.get(
    "/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/")
    }
)

module.exports = router
