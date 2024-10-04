const jwt = require('jsonwebtoken');

const User = require("../models/User")

module.exports = async function (req, res, next) {
    // get the token
    const token = req.header('x-auth-token');
   
    console.log(token);
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    
    // verify the token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        console.log('success..',req.user);
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }

    // check if the user exist
    const currentUser = await User.findById(req.user.id) ;
    if(!currentUser) {
        return res.status(401).json({msg: "The user belonging to this token does no loger exist"});
    }

    // check if user changed password after token was issued
    if (await currentUser.changePasswordAfter(decoded.iat)) {
        return res.status(401).json({msg: "User recently changed password! Please login again"})
    }

    // grant access to protected route
    req.user = currentUser;
    next();



};
