const { lookup } = require("geoip-lite")
const ip = require("ip")
function findUserLocation(req, res, next) {
    console.dir(`THIS IS BUILT INTO NODE ${req.ip}`)
    console.dir(`THIS IS A MODULE ${ip.address()}`)
    next()
}

module.exports = findUserLocation
