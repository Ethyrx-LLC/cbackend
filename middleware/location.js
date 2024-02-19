const { lookup } = require("geoip-lite")

function GeneratePublicIPv4() {
    let firstOctet = Math.floor(Math.random() * 191) + 1;
    while ([10, 172, 192].includes(firstOctet)) {
        firstOctet = Math.floor(Math.random() * 191) + 1;
    }
    const octets = [firstOctet];
    for (let i = 0; i < 3; i++) {
        octets.push(Math.floor(Math.random() * 256));
    }
    const ipAddress = octets.join('.');
    return ipAddress;
}

const env = process.env.NODE_ENV || "development"


function findUserLocation(req, res, next) {
    const userCountry = env === "development" ? lookup(GeneratePublicIPv4()) : lookup(req.ip);
    console.log(userCountry);
    // Location can be undefined
    req.userLocation = {
        country: userCountry.country,
        region: userCountry.region,
        city: userCountry.city,
        timezone: userCountry.timezone,
    }

    next()
}

module.exports = findUserLocation
