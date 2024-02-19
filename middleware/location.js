const { lookup } = require("geoip-lite")

function findUserLocation(req, res, next) {
    const userCountry = lookup(req.ip)
    req.userLocation = {
        country: userCountry.country,
        region: userCountry.region,
        city: userCountry.city,
        timezone: userCountry.timezone,
    }

    next()
}

module.exports = findUserLocation
