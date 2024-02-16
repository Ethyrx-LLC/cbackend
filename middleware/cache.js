const apicache = require("apicache")
const cache = apicache.middleware

const cacheRoute = cache("5 minutes")
const cacheCookie = cache("30 seconds")
const clearCache = apicache.clear
module.exports = { cacheCookie, cacheRoute, clearCache }
