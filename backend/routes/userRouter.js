const express = require('express');
const {
  register,
  login,
  updateUsername,
  updatePassword,
  me,
  requestResetPassword,
  resetPassword,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Update Username
router.put('/update-username', auth, updateUsername);

// Update Password
router.put('/update-password', auth, updatePassword);

// Get Current User's Details
router.get('/me', auth, me);

// Request reset password
router.post('/request-reset-password', requestResetPassword);

// Reset password
router.post('/reset-password/:token', resetPassword);


module.exports = router;
