"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// Check API
router.use(apiKey);

// Check Permissions
router.use(permission("0000"));

router.use("/v1/api", require("./access"));
router.use("/v1/api/product", require("./products"));

module.exports = router;
