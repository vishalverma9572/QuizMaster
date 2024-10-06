import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;

const Profile = () => {
  const navigate= useNavigate();
  //check user is logged in or not
  
  if (!localStorage.getItem('token')||localStorage.getItem('token')===null) {
    navigate('/login');
  }
  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = process.env.REACT_APP_BACKEND_URL + "/users/me";
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        const data = await response.json();
        console.log(data);
        setUser(data);
        setUsername(data.username);
        setEmail(data.email);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!passwordRegex.test(value)) {
      setPasswordError(
        'Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.'
      );
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

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value)
};

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (newUsername.length <= 6) {
      setUsernameError('Username must be longer than 6 characters.');
    } 
    else if(
      newUsername.includes(' ')
    ){
      setUsernameError('Username should not contain spaces.');
    }
    else {
      setUsernameError('');
      try {
        const url = process.env.REACT_APP_BACKEND_URL + "/users/update-username";
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token'),
          },
          body: JSON.stringify({ username: newUsername }), // Send newUsername in the request body
        });
        const data = await response.json();
        if (!response.ok) {
          setUsernameError(data.msg || 'Failed to update username. Please try again.' );

        } 
        else{
          alert('Username updated successfully');
          //refresh the page
          window.location.reload();
        }

         // Update state with new username
  
      } catch (error) {
        console.error('Error updating username:', error);
        setUsernameError('Error updating username. Please try again.');
      }
    }
  };
  

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Check if there are no errors and password is not empty
    if (passwordError === '' && confirmPasswordError === '' && password !== '') {
        try {
            const url = `${process.env.REACT_APP_BACKEND_URL}/users/update-password`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ password, oldPassword }), // Send password in the request body
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.msg === 'Invalid old password') {
                    setOldPasswordError(data.msg);
                }
                else {
                setPasswordError(data.msg || 'Failed to update password. Please try again.')
                }
            } else {
                alert('Password updated successfully');
                // Refresh the page or update state to reflect the password change
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setPasswordError('Error updating password. Please try again.');
        }
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
        <div className="profile-card">
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
        </div>
        <div className="profile-card">
          <form className="profile-form" onSubmit={handlePasswordSubmit}>
            <h3>Update Password</h3>
            <div className="form-group">
              <label htmlFor="oldPassword">Old Password:</label>
              <input
                type="oldPassword"
                id="oldPassword"
                value={oldPassword}
                onChange={handleOldPasswordChange}
                required
              />
              {oldPasswordError && <p className="error">{oldPasswordError}</p>}
            </div>
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
    </div>
  );
};

export default Profile;
