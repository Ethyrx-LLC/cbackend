const apicache = require("apicache")
const cache = apicache.middleware

const cacheRoute = cache("5 minutes")

module.exports = cacheRoute
