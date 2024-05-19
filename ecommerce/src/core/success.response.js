"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  [StatusCode.OK]: "OK",
  [StatusCode.CREATED]: "Created",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode[statusCode],
    metadata = {},
  }) {
    this.message = message ? message : reasonStatusCode;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message = ReasonStatusCode.OK, metadata = {} }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message = ReasonStatusCode.CREATED,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata = {},
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
  }
}

module.exports = { OK, CREATED };
