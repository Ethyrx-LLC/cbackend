require("dotenv").config()
const redis = require("redis")
const env = process.env.NODE_ENV || "development"
let redisClient
async function RunRedis() {
    env === "development"
        ? (redisClient = redis.createClient())
        : (redisClient = redis.createClient({ url: process.env.REDIS }))

    redisClient.on("error", (error) => console.error(`Error : ${error}`))

    env === "development" ? "" : await redisClient.connect()
}
env === "development" ? "" : RunRedis()
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
