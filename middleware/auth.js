const jwt = require('jsonwebtoken');

function auth (req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. Unauthorized.');

    try {
        req.user = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (e) {
        res.status(400).send('Invalid token.');
    }
}

module.exports = auth;
