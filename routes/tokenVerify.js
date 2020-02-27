const jwt = require('jsonwebtoken');
const Sentry = require('@sentry/node');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');

    if (!token) {
        Sentry.captureMessage('Access denied. User tried to access page without being logged in.');
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET)
        req.user = verified;
        next();
    } catch (err) {
        Sentry.captureMessage('Invalid Token');
        res.status(400).send('Invalid Token');
    }
}
