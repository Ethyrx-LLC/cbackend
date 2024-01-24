require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const compression = require("compression");
const passport = require("passport");
const session = require("express-session");
require("./middleware/passport")(passport);
var indexRouter = require("./routes/index");
const helmet = require("helmet");
var app = express();
const mongoDB = process.env.MONGO_URI;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
app.use(compression());
app.use(cookieParser());
app.use(logger("dev"));
app.use(
  cors({
    origin: `http://localhost:3000`,
    methods: `GET, POST, UPDATE, PATCH, DELETE`,
    allowedHeaders: `Content-Type, Accepts, Authorization`,
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
const errorHandler = (error, req, res, bext) => {
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
    .json("Internal error occured, our monkeys are hard at work to figure out what went wrong!");
};
app.use(errorHandler);

module.exports = app;
