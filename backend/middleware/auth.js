const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    console.log("Auth middleware");
    const token = req.header('x-auth-token');

    console.log(token);
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        console.log('success..', req.user);
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
