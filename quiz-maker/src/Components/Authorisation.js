import React, { useState } from 'react';
import './Profile.css';

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;

const Profile = () => {
  const user
    = {
    username: 'john_doe',
    email: "johndoe@example.com",
  };
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!passwordRegex.test(value)) {
      setPasswordError('Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
    } else {
      setPasswordError('');
    }
    if (value !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (newUsername.length <= 6) {
      setUsernameError('Username must be longer than 6 characters.');
    } else {
      setUsernameError('');
      // Update username logic here
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordError === '' && confirmPasswordError === '' && password !== '') {
      // Update password logic here
    }
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      <div className="profile-info">
        <div className="profile-detail">
          <span className="profile-label">Username:</span>
          <span className="profile-value">{username}</span>
        </div>
        <div className="profile-detail">
          <span className="profile-label">Email:</span>
          <span className="profile-value">{email}</span>
        </div>
      </div>
      <div className="profile-forms">
        <form className="profile-form" onSubmit={handleUsernameSubmit}>
          <h3>Update Username</h3>
          <div className="form-group">
            <label htmlFor="newUsername">New Username:</label>
            <input
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={handleUsernameChange}
              required
            />
            {usernameError && <p className="error">{usernameError}</p>}
          </div>
          <button type="submit">Update Username</button>
        </form>
        <form className="profile-form" onSubmit={handlePasswordSubmit}>
          <h3>Update Password</h3>
          <div className="form-group">
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {passwordError && <p className="error">{passwordError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}
          </div>
          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
