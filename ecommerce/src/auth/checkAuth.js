"use strict";

const { findById } = require("../services/apiKey.service");
const { HEADER } = require("../utils/header");

const apiKey = async (req, res, next) => {
  try {
    // Check API Key in header
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({ message: "Forbidden Error" });
    }

    // Check object key in database
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({ message: "Forbidden Error" });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: "Permission denied" });
    }

    console.log("Permission: ", req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({ message: "Permission denied" });
    }

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
