const { lookup } = require("geoip-lite")
const iso3166 = require("iso-3166-2")

function GeneratePublicIPv4() {
    let firstOctet = Math.floor(Math.random() * 191) + 1
    while ([10, 172, 192].includes(firstOctet)) {
        firstOctet = Math.floor(Math.random() * 191) + 1
    }
    const octets = [firstOctet]
    for (let i = 0; i < 3; i++) {
        octets.push(Math.floor(Math.random() * 256))
    }
    const ipAddress = octets.join(".")
    return ipAddress
}

const env = process.env.NODE_ENV || "development"

function findUserLocation(req, res, next) {
    const userCountry =
        env === "development" ? lookup(GeneratePublicIPv4()) : lookup(req.ip)
    const fullCountryName = iso3166.country(userCountry.country)
    console.log(fullCountryName)
    // Location can be undefinedc
    req.userLocation = {
        country: userCountry.country,
        country_full: fullCountryName.name,
        region: userCountry.region,
        region_full: userCountry.region,
        city: userCountry.city,
        timezone: userCountry.timezone,
    }

    console.log(req.userLocation)

    next()
}

module.exports = findUserLocation
