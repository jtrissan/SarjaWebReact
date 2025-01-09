import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Register() {
    const [nimi, setNimi] = useState('');
    const [email, setEmail] = useState('');
    const [taso, setTaso] = useState('');
    const [puhelin, setPuhelin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nimi, email, taso, puhelin, password }),
        });

        if (response.ok) {
            navigate('/login');
        } else {
            alert('Rekisteröityminen epäonnistui');
        }
    };

    return (
        <div className="containerS">
            <h1>Rekisteröidy</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nimi">Nimi:</label>
                    <input
                        type="text"
                        id="nimi"
                        name="nimi"
                        value={nimi}
                        onChange={(e) => setNimi(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Sähköposti:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="taso">Taso:</label>
                    <input
                        type="text"
                        id="taso"
                        name="taso"
                        value={taso}
                        onChange={(e) => setTaso(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="puhelin">Puhelin:</label>
                    <input
                        type="text"
                        id="puhelin"
                        name="puhelin"
                        value={puhelin}
                        onChange={(e) => setPuhelin(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Salasana:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Rekisteröidy</button>
            </form>

            <div className="links">
                <a href="/login">Kirjaudu sisään</a>
            </div>
        </div>
    );
}

export default Register;