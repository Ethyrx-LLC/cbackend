require("dotenv").config();
var express = require("express");
var path = require("path");

var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const compression = require("compression");
const passport = require("passport");

require("./middleware/passport")(passport);
var indexRouter = require("./routes/index");

var app = express();
const mongoDB = process.env.MONGO_URI;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
app.use(
  cors({ credentials: true, origin: "http://localhost:3000", allowedHeaders: ["Content-Type"] })
);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
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
