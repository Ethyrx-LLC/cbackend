const { lookup } = require("geoip-lite")

function findUserLocation(req, res, next) {
    console.log(lookup(req.ip))
    next()
}

module.exports = findUserLocation
