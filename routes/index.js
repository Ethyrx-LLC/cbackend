const express = require("express");
const router = express.Router();
const listing_controller = require("../controllers/listing");
const user_controller = require("../controllers/user");
const comments_controller = require("../controllers/comments");
const categories_controller = require("../controllers/category");

// LISTINGS ROUTE
router.get("/listings/create", listing_controller.create_listing_get);
router.post("/listings/create", listing_controller.create_listing_post);
router.get("/listings", listing_controller.display_listings_all);
router.get("/listing-detail/:id", listing_controller.display_listing_detail);
router.delete("/listing-detail/:id/delete", listing_controller.delete_listing_post);
router.put("/listing-detail/:id/upvote", listing_controller.upvote_listing_post);
router.put("/listing-detail/:id/viewsincrease", listing_controller.views_increase_listing_post);

// USERS ROUTES
router.post("/user/create", user_controller.create_users_post);
router.post("/user/login", user_controller.login_post);
router.post("/user/logout", user_controller.logout_post);
router.get("/users", user_controller.users_get);
router.get("/user/:id", user_controller.user_get);
router.post("/user/:id/emoji", user_controller.emoji_set);

// COMMENT ROUTES
router.get("/listing/:id/comments", comments_controller.list_comments_get);
router.post("/listing/:id/comment/create", comments_controller.create_comment_post);
router.delete("/listing/:id/comment/delete/:id", comments_controller.delete_comment_post);
router.put("/listing/:id/comment/upvote/:id", comments_controller.upvote_comment_post);
router.put("/listing/:id/comment/downvote/:id", comments_controller.downvote_comment_post);

// CATEGORY ROUTES
router.get("/categories", categories_controller.list_categories_get);
router.get("/category/:id", categories_controller.category_detail_get);
router.post("/category/create", categories_controller.category_add_post);
router.delete("/category/delete/:id", categories_controller.category_delete_post);

// USER API
router.get("/cookie", user_controller.cookie);
module.exports = router;
