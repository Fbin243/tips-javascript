const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const compression = require("compression");
const app = express();

// console.log("Process: ", process.env);

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
app.use("/", require("./routes"));

module.exports = app;
