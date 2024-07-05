import React, { useState } from 'react';
import { signIn } from '../api';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await signIn(formData);
            console.log(res.data);
            // Save token to local storage or state
            localStorage.setItem('token', res.data.token);
            navigate('/'); // Redirect to home page after successful sign-in
        } catch (err) {
            console.error(err.response.data);
            setError(err.response.data.msg);
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                        placeholder="Email"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        placeholder="Password"
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default SignIn;
