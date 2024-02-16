const { lookup } = require("geoip-lite")

function findUserLocation(req, res, next) {
    console.log(lookup(req.ip))
    console.log(lookup(socket.client.request.headers["cf-connecting-ip"]))
    next()
}

module.exports = findUserLocation
