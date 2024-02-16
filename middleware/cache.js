const apicache = require("apicache")
const cache = apicache.middleware

const cacheRoute = cache("5 minutes")
const clearCache = apicache.clear
module.exports = { cacheRoute, clearCache }
