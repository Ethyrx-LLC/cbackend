// Import necessary modules and packages
require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const passport = require("passport");
const initSocketServer = require("./middleware/socketserver");

// Import passport middleware configuration
require("./middleware/passport")(passport);

// Import routes
const indexRouter = require("./routes/index");

// Create an Express application
const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

const compression = require("compression");
const helmet = require("helmet");

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

// …
// Set up MongoDB connection
const mongoDB = process.env.MONGO_URI;
const MongoStore = require("connect-mongo");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

// Configure middleware and settings
app.use(
  cors({ credentials: true, origin: "http://localhost:3000", allowedHeaders: ["Content-Type"] })
);
app.use(cookieParser());

// Configure and use session middleware with MongoDB as store
const sessionMiddleware = session({
  secret: process.env.TOKEN_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoDB }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
});

app.use(sessionMiddleware);

// Initialize and use passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Enable compression middleware
app.use(compression());

// Set up logger middleware
app.use(logger("dev"));

// Parse JSON requests
app.use(bodyParser.json());

// Set up static files and URL-encoded form data handling
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Use the routes defined in indexRouter
app.use("/", indexRouter);

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  const errorMsg = {
    error_Message: error.message,
    error_Route: req.url,
    error_Method: req.method,
    error: error.stack,
  };

  console.log(errorMsg);
  const status = error.status || 400;

  res
    .status(status)
    .json("Internal error occurred, our monkeys are hard at work to figure out what went wrong!");
};

const io = initSocketServer();
app.set("socketServer", io);

// Use the custom error handling middleware
app.use(errorHandler);

// Export the configured Express application
module.exports = app;
