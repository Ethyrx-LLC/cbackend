const apicache = require("apicache")
let cache = apicache.middleware
const cacheRoute = cache("5 minutes", onlyStatus200)
module.exports = cacheRoute
