var express = require("express");
var router = express.Router();
const listing_controller = require("../controllers/listing");

/* GET home page. */

router.get("/listings", listing_controller.display_all_listings);
router.get("/listing-detail/:id", listing_controller.display_listing_detail);
module.exports = router;
