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

function verifyUsersCache(parameter) {
    return async (req, res, next) => {
        const cache = parameter

        try {
            const cacheResults = await redisClient.get(cache)
            const users = JSON.parse(cacheResults)
            if (cacheResults) {
                return res.status(200).json({
                    users,
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

function verifyAlertsCache(parameter) {
    return async (req, res, next) => {
        const cache = parameter

        try {
            const cacheResults = await redisClient.get(cache)
            const alerts = JSON.parse(cacheResults)
            if (cacheResults) {
                return res.status(200).json({
                    alerts,
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

function verifyChatsCache(parameter) {
    return async (req, res, next) => {
        const cache = parameter

        try {
            const cacheResults = await redisClient.get(cache)
            if (cacheResults) {
                const userChats = JSON.parse(cacheResults)
                console.log(userChats)
                res.status(200).json({
                    chats: userChats.chats,
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

module.exports = {
    verifyListingsCache,
    verifyUsersCache,
    verifyAlertsCache,
    verifyChatsCache,
}
