const apicache = require("apicache")
let cache = apicache.middleware
const cacheRoute = cache("5 minutes")
module.exports = cacheRoute
