import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../static/styles.css';

function Login({ setCurrentUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setCurrentUser({ isAuthenticated: true, admin: data.admin });
            navigate('/');
        } else {
            alert('Kirjautuminen epäonnistui');
        }
    };

    return (
        <div className="containerS">
            <h1>Kirjaudu sisään</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Sähköposti:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Salasana:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Kirjaudu</button>
            </form>
        </div>
    );
}

export default Login;