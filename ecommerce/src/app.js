const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init_mongodb");
const { checkOverload } = require("./helpers/check_connect");
checkOverload();

// init routes
app.get("/", (req, res) => {
  const strCompress = "Hello World";
  return res
    .status(200)
    .json({ message: "Hello World", metadata: strCompress.repeat(1000) });
});

module.exports = app;
