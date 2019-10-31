const admin = require('firebase-admin')
const ErrorUtils = require('./errorsUtils');



const getAuthToken = (req, res, next) => {

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
};

async function checkIfAuthenticated(req, res, next) {

    if (!req.path.includes('/admin')) {
        return next();
    }
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;
            if (authToken == null) {
                const userInfo = await admin.auth().verifyIdToken(authToken);
                req.authId = userInfo.uid;
                req.isAdminRequest = true;
                return next();
            }
            //TODO - to remove
            req.authId = '123123123';
            return next();
        } catch (e) {
            console.log('check authentication error %j', e);
            return next(ErrorUtils.createUnauthorizedError());
        }
    });
}
module.exports = { checkIfAuthenticated };