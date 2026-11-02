import React, { useState } from 'react';
import axios from 'axios';

function SignIn({ setUser, setView }) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/signin', { user_id: userId, password })
        .then(res => {
            setUser(res.data.user);
            setView('home');
        })
        .catch(err => setError(err.response.data.error));
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h1>Sign In</h1>
            <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Sign In</button>
            {error && <p className="errormsg">{error}</p>}
        </form>
    );
}

export default SignIn;