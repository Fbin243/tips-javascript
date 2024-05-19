"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const roles = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    // Step 1: check if email exists
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop is not registered");
    }

    // Step 2: compare password
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication failed");

    // Step 3: Create privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // Step 4: Generate token pair
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData(["_id", "name", "email"], foundShop),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    // Step 1: check if email exists
    const holderShop = await shopModel.findOne({ email }).lean(); // lean() to return plain object instead of mongoose object
    if (holderShop) {
      throw new BadRequestError("Email already exists");
    }

    // Step 2: Hash password and save to database
    const passwordHash = await bcrypt.hash(password, 10); // salt = 10 rounds affects the time to generate the hash password, CPU intensive

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [roles.SHOP],
    });

    // Step 3: Create RSA key pair
    if (newShop) {
      // Create privateKey, publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // }); // generate RSA key pair
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      console.log({ privateKey, publicKey });

      // Step 4: Save publicKey & privateKey to database
      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError("Error creating token pair");
      }

      // Step 5: Create token pair and return
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      console.log("Created token pair: ", tokens);

      return {
        shop: getInfoData(["_id", "name", "email"], newShop),
        tokens,
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
