"use strict";

const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    const tokens = await keyTokenModel.create({
      user: userId,
      publicKey,
      privateKey,
    });

    return tokens ? tokens.publicKey : null;
  };
}

module.exports = KeyTokenService;
