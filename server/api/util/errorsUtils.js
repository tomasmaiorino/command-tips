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

function createForbiddenError(message) {
    return createError('forbidden', message, 403);
}

function createUnauthorizedError() {
    return createError('unauthorized', 'You are not authorized to make this request', 401);
}

module.exports = { createBadRequest, createError, createNotFound, createGenericError, createForbiddenError, createUnauthorizedError }