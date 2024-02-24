const redis = require("redis")
let redisClient
async function RunRedis() {
    redisClient = redis.createClient()

    redisClient.on("error", (error) => console.error(`Error : ${error}`))

    await redisClient.connect()
}

RunRedis()
function verifyListingsCache(parameter) {
    return async (req, res, next) => {
        const cache = parameter

        try {
            const cacheResults = await redisClient.get(cache)
            const listings = JSON.parse(cacheResults)
            console.log(listings.length)
            if (cacheResults) {
                return res.status(200).json({
                    listings,
                })
            } else {
                next()
            }
        } catch (error) {
            console.error(error)
            res.status(404)
            next()
        }
    }
}

function verifyListingDetailCache(parameter) {
    return async (req, res, next) => {
        const cache = parameter

        try {
            const cacheResults = await redisClient.get(cache)
            if (cacheResults) {
                const listing = JSON.parse(cacheResults)
                res.status(200).json({
                    listing,
                })
            } else {
                next()
            }
        } catch (error) {
            console.error(error)
            res.status(404)
            next()
        }
    }
}

module.exports = { verifyListingsCache, verifyListingDetailCache }
