const express = require("express")
const router = express.Router()
const listing_controller = require("../controllers/listing")
const user_controller = require("../controllers/user")
const { cacheRoute, clearCache, cacheCookie } = require("../middleware/cache")
const comments_controller = require("../controllers/comments")
const categories_controller = require("../controllers/category")

// LISTINGS ROUTE
router.get("/listings/create", listing_controller.create_listing_get)
router.post("/listings/create", listing_controller.create_listing_post)
router.get("/listings", cacheRoute, listing_controller.display_listings_all)
router.get(
    "/listings/:id",
    cacheRoute,
    listing_controller.display_listing_detail
)
router.delete("/listings/:id/delete", listing_controller.delete_listing_post)
router.put("/listings/:id/upvote", listing_controller.upvote_listing_post)

// USERS ROUTES
router.post("/users/create", user_controller.create_users_post)
router.post("/users/login", user_controller.login_post)
router.post("/users/logout", clearCache, user_controller.logout_post)
router.get("/users", cacheRoute, user_controller.users_get)
router.get("/users/:id", cacheRoute, user_controller.user_get)
router.post("/users/:id/emoji", user_controller.emoji_set)

// COMMENT ROUTES
router.post(
    "/listings/:id/comments/create",
    comments_controller.create_comment_post
)
router.get(
    "/listings/:id/comments",
    cacheRoute,
    comments_controller.list_comments_get
)
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
router.get("/categories", cacheRoute, categories_controller.list_categories_get)
router.get(
    "/categories/:id",
    cacheRoute,
    categories_controller.category_detail_get
)
router.post("/categories/create", categories_controller.category_add_post)
router.delete(
    "/categories/:id/delete",
    categories_controller.category_delete_post
)

// USER API
router.get("/cookies", cacheCookie, user_controller.cookie)
module.exports = router
