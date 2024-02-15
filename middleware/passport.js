const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
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
}
passport.serializeUser((user, done) => {
    console.log("SERIALIZE" + user)
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
