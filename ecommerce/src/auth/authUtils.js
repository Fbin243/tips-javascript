"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { HEADER } = require("../utils/header");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // Access token
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) console.log("error verify: ", err);
      else console.log("decoded: ", decoded);
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  // Step 1: Check userId missing ??
  const userId = req.headers[HEADER.CLIENT_ID];
  console.log("userId: ", userId);
  if (!userId) throw new AuthFailureError("Invalid request");

  // Step 2: Get access token
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found key store");

  // Step 3: Verify token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request");
  try {
    console.log("accessToken: ", accessToken);
    console.log(keyStore);
    const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
    // Step 4: Compare userId in token with userId in header
    if (userId !== decodedUser.userId) {
      throw new AuthFailureError("Invalid user");
    }
    req.keyStore = keyStore;
    // Step 5: Oke -> Return next()
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
