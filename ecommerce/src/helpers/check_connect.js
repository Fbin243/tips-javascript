"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND5 = 5000;

/**
 * Count connection
 */
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

/**
 * Check overload
 */
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCPU = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Assume 1 connection = 1 core
    const maxConnection = numCPU * 5;

    console.log("Number of connections: ", numConnection);
    console.log("Memory usage: ", memoryUsage / 1024 / 1024, "MB");

    if (numConnection > maxConnection) {
      console.log(`Overload: Number of connections: ${numConnection}`);
      // Notify to team ...
    }
  }, _SECOND5); // Monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
