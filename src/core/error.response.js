'use strict'

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");
const reasonPhrases = require("../utils/reasonPhrases");

const StatusCode = {
    FORBIDEN: 403,
    CONFLICT: 409,
}

const ReasonStatusCode = {
    FORBIDEN: 'Bad request error',
    CONFLICT: 'Conflict error',
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = reasonPhrases.FORBIDEN, statusCode = StatusCode.FORBIDEN) {
        super(message, statusCode);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = reasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode);
    }
}
class ForbidenError extends ErrorResponse {
    constructor(message = reasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbidenError,
}