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

async function getUserInfo(token) {
    return admin.auth().verifyIdToken(token);
}

async function checkIfAuthenticated(req, res, next) {

    if (!req.path.includes('/admin')) {
        return next();
    }
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;
            if (authToken == null) {   
                const userInfo = await getUserInfo(authToken);
                req.authId = userInfo.uid;
                req.isAdminRequest = true;
                return next();
            }
            //TODO - to remove
            req.authId = '123123123';
            return next();
        } catch (e) {
            console.log('check new authentication error %j', e);
            return next(ErrorUtils.createUnauthorizedError());
        }
    });
}

function print () {

    console.log('printing content');
}
module.exports = { checkIfAuthenticated, getUserInfo, print };