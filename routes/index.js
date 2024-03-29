require("dotenv").config()
const express = require("express")
const router = express.Router()
const listing_controller = require("../controllers/listing")
const user_controller = require("../controllers/user")
const findUserLocation = require("../middleware/location")
const comments_controller = require("../controllers/comments")
const turnstileSignUp = require("../middleware/turnstile")
const passport = require("passport")
const categories_controller = require("../controllers/category")
const chat_controller = require("../controllers/chat")
const permissions = require("../middleware/authorization/permissions")
const multer = require("multer")
const env = process.env.NODE_ENV || "development"
const upload = multer({
    dest: env === "development" ? "" : "/hdd/kameelist/images",
})
// LISTINGS ROUTE
router.get("/listings/create", listing_controller.create_listing_get)
router.post(
    "/listings/create",
    upload.array("photos", 6),
    findUserLocation,
    listing_controller.create_listing_post
)
router.get(
    "/listings/:id",
    findUserLocation,
    listing_controller.display_listing_detail
)
router.get("/listings", listing_controller.display_listings_all)
router.delete(
    "/listings/:id/delete",
    permissions.deleteListingCheck,
    listing_controller.delete_listing_post
)
router.put("/listings/:id/upvote", listing_controller.upvote_listing_post)

// USER ALERT ROUTES
router.get("/users/alerts", user_controller.alerts_get)
router.put("/users/alerts/:id/read", user_controller.mark_as_read)
router.put("/users/alerts/read", user_controller.mark_all_as_read)

// USER CHAT ROUTES
router.post("/users/chats/create/:id", chat_controller.new_chat)
router.post("/users/chats/:id/messages/create", chat_controller.send_message)
router.get("/users/chats", chat_controller.list_chats)
router.get("/users/chats/:id/messages", chat_controller.all_messages)

// USERS ROUTES
router.post("/users/create", turnstileSignUp, user_controller.create_users_post)
router.post("/users/login", user_controller.login_post)
router.post("/users/logout", user_controller.logout_post)
router.get("/users", user_controller.users_get)
router.post("/users/:id/emoji", user_controller.emoji_set)
router.get("/users/:id", user_controller.user_get)

// COMMENT ROUTES
router.post(
    "/listings/:id/comments/create",
    comments_controller.create_comment_post
)
router.get("/listings/:id/comments", comments_controller.list_comments_get)
router.delete(
    "/listings/:id/comments/:id/delete",
    comments_controller.delete_comment_post
)
router.put(
    "/listings/:id/comments/:id/upvote",
    comments_controller.upvote_comment_post
)
router.put(
    "/listings/:id/comments/:id/downvote",
    comments_controller.downvote_comment_post
)

// CATEGORY ROUTES
router.get("/categories", categories_controller.list_categories_get)
router.get("/categories/:id", categories_controller.category_detail_get)
router.post("/categories/create", categories_controller.category_add_post)
router.delete(
    "/categories/:id/delete",
    categories_controller.category_delete_post
)

router.get("/google", passport.authenticate("google"))

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/login" }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/")
    }
)

// USER API
router.get("/cookies", user_controller.cookie)

module.exports = router
