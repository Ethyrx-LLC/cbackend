const { lookup } = require("geoip-lite")

function findUserLocation(req, res, next) {
    console.log(lookup(req.ip))

    console.log(req.header("cf-connecting-ip"))
    console.log(req.header("true-client-ip"))
    console.log(req.header("x-real-ip"))
    next()
}

module.exports = findUserLocation
