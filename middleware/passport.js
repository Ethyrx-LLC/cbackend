require("dotenv").config()
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/user")
const bcrypt = require("bcryptjs")

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username: username })
                if (!user) {
                    return done(null, false, {
                        message: "Incorrect credentials",
                    })
                }
                const match = await bcrypt.compare(password, user.password)
                if (!match) {
                    return done(null, false, {
                        message: "Incorrect credentials",
                    })
                }

                return done(null, user)
            } catch (err) {
                return done(err)
            }
        })
    )

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_REDIRECT_URL,
                passReqToCallback: true,
                scope: ["email", "profile"],
            },
            function (request, accessToken, refreshToken, profile, done) {
                console.log(`The request is ${request}`)
                console.log(`The access token is ${accessToken}`)
                console.log(`The profile is ${profile}`)
                done(null, profile)
            }
        )
    )
}

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (err) {
        done(err)
    }
})
