const firebaseHelper = require('./FirebaseHelper');
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
    //console.debug('checking token ' + token);
    return firebaseHelper.getUserInfo(token);
}

async function checkIfAuthenticated(req, res, next) {

    if (!req.path.includes('/admin')) {
        return next();
    }
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;
            if (authToken) {
                const userInfo = await getUserInfo(authToken);
                console.log('user found ' + JSON.stringify(userInfo));
                req.authId = userInfo.uid;
                req.isAdminRequest = true;
                return next();
            }
            return next();
        } catch (e) {
            console.log('check new authentication error: ', e);
            return next(ErrorUtils.createUnauthorizedError());
        }
    });
}

module.exports = { checkIfAuthenticated, getUserInfo };