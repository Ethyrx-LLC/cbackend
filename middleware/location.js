const { lookup } = require("geoip-lite")
const ip = require("ip")
function findUserLocation(req, res, next) {
    const ip =
        req.headers["cf-connecting-ip"] ||
        req.headers["x-real-ip"] ||
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        ""

    console.log(ip)
    next()
}

module.exports = findUserLocation
