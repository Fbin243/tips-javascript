"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");
const roles = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
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
        code: "201",
        metadata: {
          shop: getInfoData(["_id", "name", "email"], newShop),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
