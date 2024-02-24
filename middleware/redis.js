/* const redis = require("redis")
const fetch = require("node-fetch")
const { promisify } = require("util")

const client = redis.createClient()

// Promisify the Redis client methods
const getAsync = promisify(client.GET).bind(client)
const setexAsync = promisify(client.SETEX).bind(client)

async function checkCache(time) {
    return async (req, res, next) => {
        const key = req.originalUrl

        try {
            const cachedData = await getAsync(key)

            if (cachedData) {
                res.json(JSON.parse(cachedData))
            } else {
                const apiUrl = "https://staging.kameelist.com/" + req.path
                const response = await fetch(apiUrl)
                const data = await response.json()

                await setexAsync(key, time, JSON.stringify(data))

                res.json(data)
            }
        } catch (error) {
            console.error("Cache error:", error)
            res.status(500).json({
                error: "An error occurred while processing the request.",
            })
        }
    }
}
module.exports = checkCache
 */
