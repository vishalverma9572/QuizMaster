const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const generateUniqueId = require('generate-unique-id');
const validations = require('../validators/validations');
require('dotenv').config();

// Register
router.post('/', auth, async (req, res) => {
  const zodResult = quizSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return res.status(400).json({ msg: errors });
  }

  const { title, questions, timeLimit } = zodResult.data;

  try {
    // Generate quiz_id with user information
    let quiz_id = generateUniqueId({
      length: 10,
      useLetters: true,
      useNumbers: true,
    });

    const user = await User.findById(req.user.id);
    quiz_id = `${user.username}_${quiz_id}`;

    // Check if the quiz ID already exists
    let existingQuiz = await Quiz.findOne({ quiz_id });
    if (existingQuiz) {
      return res.status(400).json({ msg: 'Quiz ID already exists' });
    }

    // Create a new quiz
    const newQuiz = new Quiz({
      title,
      quiz_id,
      questions,
      createdBy: req.user.id,
      timeLimit,
    });

    // Save the quiz
    const quiz = await newQuiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Function to send welcome email
const sendWelcomeEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to QuizMaster!',
      html: `
                <p>Dear User,</p>
                <p>Thank you for registering with QuizMaster!</p>
                <p>Click the button below to visit our website:</p>
                <a href="${process.env.FRONTEND_URL}" target="_blank" style="display: inline-block; background-color: #2d3b45; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit QuizMaster</a>
                <p>Best regards,</p>
                <p>The QuizMaster Team</p>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (err) {
    console.error('Error sending welcome email:', err);
  }
};

// Login
router.post('/login', async (req, res) => {
  const zodResult = validations.loginSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return res.status(400).json({ msg: errors });
  }

  const { email, password } = zodResult.data;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Username
router.put('/update-username', auth, async (req, res) => {
  const zodResult = validations.updateUsernameSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return res.status(400).json({ msg: errors });
  }

  const { username } = zodResult.data;
  try {
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ msg: 'Username already exists' });

    const user = await User.findById(req.user.id);
    user.username = username;
    await user.save();
    res.json({ msg: 'Username updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Password
router.put('/update-password', auth, async (req, res) => {
  const zodResult = validations.updatePasswordSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return res.status(400).json({ msg: errors });
  }

  const { password } = zodResult.data;

  try {
    const user = await User.findById(req.user.id);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.json({ msg: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Current User's Details
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

// Request reset password
router.post('/request-reset-password', async (req, res) => {
  const zodResult = validations.requestPasswordResetSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return res.status(400).json({ message: errors });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token and expiry
    const resetToken = generateUniqueId({ length: 20 });
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send request reset password email
    sendRequestResetPasswordEmail(user.email, resetToken);

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Function to send request reset password email
const sendRequestResetPasswordEmail = async (email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASSWORD // Your email password
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Your Password',
            html: `
                <p>Dear User,</p>
                <p>You have requested to reset your password.</p>
                <p>Please click the link below to reset your password:</p>
                <p><a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset Password</a></p>
                <p>If you did not request this change, please ignore this email.</p>
                <p>Best regards,</p>
                <p>The QuizMaster Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Request reset password email sent to ${email}`);
    } catch (err) {
        console.error('Error sending request reset password email:', err);
    }
};


// Reset password
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset token and expiry
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        // Send reset password email
        sendResetPasswordEmail(user.email);

        res.json({ message: 'Password has been reset' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Function to send reset password email
const sendResetPasswordEmail = async (email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASSWORD // Your email password
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Confirmation',
            html: `
                <p>Dear User,</p>
                <p>Your password has been successfully reset.</p>
                <p>If you did not request this change, please contact us immediately.</p>
                <p><strong>Caution:</strong> If this change was not done by you, we recommend changing your password immediately.</p>
                <p>Best regards,</p>
                <p>The QuizMaster Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reset password email sent to ${email}`);
    } catch (err) {
        console.error('Error sending reset password email:', err);
    }
};


module.exports = router;
