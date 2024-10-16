const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const generateUniqueId = require('generate-unique-id');
const validations = require('../validators/validations');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
require('dotenv').config();

const register = catchAsync(async (req, res, next) => {
  const zodResult = validations.registrationSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return next(new AppError(errors, 400));
  }

  const { username, email, password } = zodResult.data;

  let user = await User.findOne({ email });
  if (user) return next(new AppError('User already exists', 400));

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
      res.json({ token });
    }
  );
});

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
  } catch (err) {
    console.error('Error sending welcome email:', err);
  }
};

const login = catchAsync(async (req, res, next) => {
  const zodResult = validations.loginSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return next(new AppError(errors, 400));
  }

  const { email, password } = zodResult.data;

  let user = await User.findOne({ email });
  if (!user || (await bcrypt.compare(password, user.password)))
    return next(new AppError('Invalid credentials', 401));

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
});

const updateUsername = catchAsync(async (req, res, next) => {
  const zodResult = validations.updateUsernameSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return next(new AppError(errors, 400));
  }

  const { username } = zodResult.data;

  const userExists = await User.findOne({ username });
  if (userExists) return next(new AppError('Username already taken', 400));

  const user = await User.findById(req.user.id);
  user.username = username;
  await user.save();
  res.json({ msg: 'Username updated' });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const zodResult = validations.updatePasswordSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return next(new AppError(errors, 400));
  }

  const { oldPassword, password } = zodResult.data;

  const user = await User.findById(req.user.id);

  // Check if the old password matches
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // Generate a new salt and hash the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();
  res.json({ msg: 'Password updated' });
});

const me = catchAsync(async (req, res,  next) => {
  const user = await User.findById(req.user.id).select('-password -__v -_id');
  if (!user) 
    return next(new AppError('User not found', 404));

  res.json(user);
});

const requestResetPassword = catchAsync(async (req, res, next) => {
  const zodResult = validations.requestPasswordResetSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return next(new AppError(errors, 400));
  }

  const { email } = zodResult.data;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user found with that email', 404));
  }

  const resetToken = generateUniqueId({ length: 20 });
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;
  await user.save();

  sendRequestResetPasswordEmail(user.email, resetToken);

  res.json({ message: 'Password reset email sent' });
});

const sendRequestResetPasswordEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD,
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
  } catch (err) {
    console.error('Error sending request reset password email:', err);
  }
};

const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
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
});

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
