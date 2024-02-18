const { lookup } = require("geoip-lite")

function findUserLocation(req, res, next) {
    req.userLocation = lookup(req.ip)
    res.userLocation = lookup(req.ip)

    next()
}

module.exports = findUserLocation
