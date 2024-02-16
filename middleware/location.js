const { lookup } = require("geoip-lite")
const ip = require("ip")
function findUserLocation(req, res, next) {
    console.log(lookup(req.ip))
    console.log(ip.address())

    next()
}

module.exports = findUserLocation
