const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require("./dbs/init_mongodb");
// const { checkOverload } = require("./helpers/check_connect");
// checkOverload();

// init routes
app.use(require("./routes"));

// handling errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500; // Default 500 for internal server error
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
