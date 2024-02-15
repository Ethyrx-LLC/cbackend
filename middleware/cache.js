const apicache = require("apicache")
let cache = apicache.middleware
function cacheRoute() {
    cache("5 minutes")
}
module.exports = cacheRoute
