const passport = require("passport")
const express = require("express")
const router = express.Router()

// GOOGLE REDIRECT
app.get("/", passport.authenticate("google"))

app.get(
    "/callback",
    passport.authenticate("google", { failureRedirect: "/auth/login" }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/")
    }
)

module.exports = router
