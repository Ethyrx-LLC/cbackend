require("dotenv").config;
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");

var app = express();
const mongoDB = process.env.MONGODB_URI;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
app.use(cookieParser());
app.use(logger("dev"));
app.use(
  cors({
    origin: `http://localhost:3000`,
    methods: `GET, POST, UPDATE, PATCH, DELETE`,
    allowedHeaders: `Content-Type, Accepts, Authorization`,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;
