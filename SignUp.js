import React, { useState } from 'react';
import axios from 'axios';

function SignUp({ setView }) {
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/signup', { user_id: userId, name, password })
        .then(() => {
            setView('signin'); 
        })
        .catch(err => setError(err.response.data.error));
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h1>Sign Up</h1>
            <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" required />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Create Account</button>
            {error && <p className="errormsg">{error}</p>}
        </form>
    );
}

export default SignUp;