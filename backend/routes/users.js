const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ msg: `Server error ${err}` });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});
// UPDATE USERNAME
router.put('/update-username',auth, async (req, res) => {
    const { username} = req.body;
    try {
        // check if username already exists
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ msg: 'Username already exists' });

        const user = await User.findById(req.user.id);
        user.username = username;
        await user.save();
        res.json({ msg: 'Username updated' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}
);


//update password
router.put('/update-password',auth, async (req, res) => {
    const { password} = req.body;
    try {
        const user = await User.findById(req.user.id);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.json({ msg: 'Password updated' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }   
}
);




// Get current user's details
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -__v -_id');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});



        


module.exports = router;
