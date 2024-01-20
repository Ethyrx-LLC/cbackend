var express = require("express");
var router = express.Router();
const listing_controller = require("../controllers/listing");
const user_controller = require("../controllers/user");
const authorize = require("../middleware/verification");

/* GET home page. */

router.get("/listings/create", authorize, listing_controller.create_listing_get);
router.post("/listings/create", authorize, listing_controller.create_listing_post);
router.get("/listings", listing_controller.display_listings_all);
router.get("/listing-detail/:id", listing_controller.display_listing_detail);
router.delete("/listing-detail/:id/delete", authorize, listing_controller.delete_listing_post);
router.put("/listing-detail/:id/upvote", authorize, listing_controller.upvote_listing_post);

router.post("/user/create", user_controller.create_users_post);
router.post("/user/login", user_controller.create_users_post);
router.post("/user/logout", user_controller.logout_post);
router.get("/users", user_controller.users_get);
router.get("/user/:id", user_controller.user_get);
module.exports = router;
