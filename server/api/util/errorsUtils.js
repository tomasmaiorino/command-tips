function createBadRequest(message) {
    return createError('bad request', message, 400);
}

function createNotFound(message) {
    return createError('not found', message, 404);
}

function createError(typeError, message, code) {
    let error = new Error(typeError);
    error.status = code;
    error.message = message;
    return error;
}

function createGenericError(message) {
    return createError('internal server error', message, 500);
}

module.exports = { createBadRequest, createError, createNotFound, createGenericError }