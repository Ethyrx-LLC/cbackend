require("dotenv").config()
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../../models/user")

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_REDIRECT_URL,
            scope: ["email", "profile"],
        },
        async function (accessToken, refreshToken, profile, done) {
            console.log(`The access token is ${accessToken}`)
            console.log(`The profile is ${profile}`)
            done(null, profile)
        }
    )
)

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
