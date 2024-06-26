"use strict";

const mongoose = require("mongoose");
const {
  db: { username, password, host, name, port },
} = require("../configs/config.mongodb");
const connectString = `mongodb+srv://${username}:${password}@${host}/${name}`;
const { countConnect } = require("../helpers/check_connect");

console.log("Connect String: ", connectString);

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    // dev
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => {
        console.log("Connected to MongoDB", countConnect());
      })
      .catch((err) => {
        console.error(err);
      });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }

    return this.instance;
  }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
