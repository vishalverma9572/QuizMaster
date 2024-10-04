const jwt = require('jsonwebtoken');
const user = require('../models/User');   
module.exports = function (req, res, next) {
    console.log("Auth middleware");
    const token = req.header('x-auth-token');
    console.log(token);
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    const id_user = req.user.id;
    // Check if the user still exists
    const find_user = (id) => {
        user.findById(id)
            .then(foundUser => {
                if (!foundUser) {
                    return res.status(404).json({ msg: 'User not found' });
                }
                next();
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).json({ msg: 'Server error' });
            });
    }

    const token_valid_or_not = () => {
        if (req.user) {
            user.findById(req.user.id)
                .then(user => {
                    if (user.resetTokenExpiry < Date.now()) {
                        return res.status(401).json({ msg: 'Token is not valid' });
                    }
                })
                .catch(err => { console.log(err) })
        }
    }

    try {
        token_valid_or_not();
        find_user(id_user);
        next();
    } catch (err) {
        console.log(err);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        console.log('success..', req.user);
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
