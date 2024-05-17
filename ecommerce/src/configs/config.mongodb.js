"use strict";
require("dotenv").config();

// Level 0
// const config = {
//   app: {
//     port: 3055,
//   },
//   db: {
//     host: "localhost",
//     port: 27017,
//     name: "ecommerce",
//   },
// };

// Level 1
// const dev = {
//   app: {
//     port: 3055,
//   },
//   db: {
//     host: "localhost",
//     port: 27017,
//     name: "dbDev",
//   },
// };

// const prod = {
//   app: {
//     port: 3055,
//   },
//   db: {
//     host: "localhost",
//     port: 27017,
//     name: "dbProd",
//   },
// };

// Level 2
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "root",
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "dbDev",
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "root",
    host: process.env.PRO_DB_HOST || "localhost",
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || "dbPro",
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
