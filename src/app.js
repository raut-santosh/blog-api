const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config()
require('../config/database')

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/public/uploads", express.static("uploads"));

// routing
require("./routes")(app);

// to handle all request which are not above
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// for our errors (middleware by docs express)
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      msg: error.message,
    },
  });
});

module.exports = app;