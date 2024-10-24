const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const generateUniqueId = require('generate-unique-id');
const validations = require('../validators/validations');
require('dotenv').config();

const register = async (req, res) => {
  const zodResult = validations.registrationSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return res.status(400).json({ msg: errors });
  }

  const { username, email, password } = zodResult.data;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ username, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;

        // Send welcome email
        // sendWelcomeEmail(email);

        res.json({ token });
      }
    );
  } catch (error) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

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

const login = async (req, res) => {
  console.log('Login called');
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
};

const updateUsername = async (req, res) => {
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
};

const updatePassword = async (req, res) => {
  const zodResult = validations.updatePasswordSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return res.status(400).json({ msg: errors });
  }

  const { oldPassword, password } = zodResult.data;

  try {
    const user = await User.findById(req.user.id);

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid old password' });
    }

    // Generate a new salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.json({ msg: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};





const me = async (req, res) => {
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
};

const requestResetPassword = async (req, res) => {
  const zodResult = validations.requestPasswordResetSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return res.status(400).json({ message: errors });
  }

  const { email } = zodResult.data;

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
};

const sendRequestResetPasswordEmail = async (email, token) => {
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
      subject: 'Reset Your Password',
      html: `
                <p>Dear User,</p>
                <p>You have requested to reset your password.</p>
                <p>Please click the link below to reset your password:</p>
                <p><a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset Password</a></p>
                <p>If you did not request this change, please ignore this email.</p>
                <p>Best regards,</p>
                <p>The QuizMaster Team</p>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Request reset password email sent to ${email}`);
  } catch (err) {
    console.error('Error sending request reset password email:', err);
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const {newPassword} = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

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
};

const sendResetPasswordEmail = async (email) => {
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
      subject: 'Password Reset Confirmation',
      html: `
                <p>Dear User,</p>
                <p>Your password has been successfully reset.</p>
                <p>If you did not request this change, please contact us immediately.</p>
                <p><strong>Caution:</strong> If this change was not done by you, we recommend changing your password immediately.</p>
                <p>Best regards,</p>
                <p>The QuizMaster Team</p>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reset password email sent to ${email}`);
  } catch (err) {
    console.error('Error sending reset password email:', err);
  }
};

module.exports = {
  register,
  login,
  updateUsername,
  updatePassword,
  me,
  requestResetPassword,
  resetPassword,
};
