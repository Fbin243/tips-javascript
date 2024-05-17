"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const roles = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // Step 1: check if email exists
      const holderShop = await shopModel.findOne({ email }).lean(); // lean() to return plain object instead of mongoose object
      if (holderShop) {
        return {
          code: "xxxx",
          message: "Email exists",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10); // salt = 10 rounds affects the time to generate the hash password, CPU intensive

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [roles.SHOP],
      });

      if (newShop) {
        // Create privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        }); // generate RSA key pair

        console.log({ privateKey, publicKey });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "Cannot create token",
          };
        }

        // Step 2: create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );

        console.log("Created token pair: ", tokens);

        return {
          code: "201",
          metadata: {
            shop: newShop,
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
