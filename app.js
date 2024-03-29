// Import necessary modules and packages
require("dotenv").config()
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const session = require("express-session")
const mongoose = require("mongoose")
const compression = require("compression")
const helmet = require("helmet")
const passport = require("passport")
const initSocketServer = require("./middleware/socketserver")
const app = express()

// Import passport middleware configuration
require("./middleware/strategies/passport")(passport)
require("./middleware/strategies/google")
// Import routes
const indexRouter = require("./routes/index")
const googleRouter = require("./routes/google")

// Enable trust proxy
app.set("trust proxy", 1)
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
        },
    })
)

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit")
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000,
})
// Apply rate limiter to all requests
app.use(limiter)

// …
// Set up MongoDB connection
const mongoDB = process.env.MONGO_URI
const MongoStore = require("connect-mongo")

main().catch((err) => console.log(err))

async function main() {
    await mongoose.connect(mongoDB)
}

// Configure middleware and settings

const env = process.env.NODE_ENV || "development"
app.use(
    cors({
        credentials: true,
        origin:
            env === "development"
                ? "http://localhost:3000"
                : process.env.FRONTEND_URL,
        allowedHeaders: ["Content-Type"],
    })
)
app.use(cookieParser())

// Configure and use session middleware with MongoDB as store
const sessionMiddleware = session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoDB }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: env === "development" ? false : true,
        sameSite: env === "development" ? "none" : "strict",
        domain: env === "development" ? "" : "kameelist.com",
        path: "/",
    },
})
app.use(sessionMiddleware)

// Initialize and use passport for authentication
app.use(passport.initialize())
app.use(passport.session())

// Enable compression middleware
app.use(compression())

// Set up logger middleware
app.use(logger("dev"))

// Parse JSON requests
app.use(bodyParser.json())

// Set up static files and URL-encoded form data handling
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: false }))

// Use the routes defined in indexRouter
app.use("/", indexRouter)
app.use("/google", googleRouter)

// Error handling middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
    const errorMsg = {
        error_Message: error.message,
        error_Route: req.url,
        error_Method: req.method,
        error: error.stack,
    }

    console.log(errorMsg)
    console.log("THE ERROR STATUS IS:" + error.status)
    const status = error.status || 500 // Default to 500 for internal server errors
    console.log("TEST" + status)

    res.status(status).json({
        error: "Internal error occurred, our monkeys are hard at work to figure out what went wrong!",
    })
}

const io = initSocketServer()
app.set("socketServer", io)

// Use the custom error handling middleware
app.use(errorHandler)

// Export the configured Express application
module.exports = app
