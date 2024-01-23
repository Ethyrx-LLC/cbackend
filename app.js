require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const compression = require("compression");
var indexRouter = require("./routes/index");
const helmet = require("helmet");
var app = express();
const mongoDB = process.env.MONGO_URI;
console.log(mongoDB);
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
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;
