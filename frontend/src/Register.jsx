import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../static/styles.css';

function Register() {
    const [nimi, setNimi] = useState('');
    const [email, setEmail] = useState('');
    const [puhelin, setPuhelin] = useState('');
    const [taso, setTaso] = useState('e');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            alert('Salasanat eivät täsmää');
            return;
        }

        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nimi,
                email,
                puhelin,
                taso,
                password,
            }),
        });

        if (response.ok) {
            alert('Rekisteröityminen onnistui');
        } else {
            alert('Rekisteröityminen epäonnistui');
        }
    };

    return (
        <div className="containerS">
            <h1>Rekisteröityminen</h1>
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
                    <label htmlFor="puhelin">Puhelinnumero:</label>
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
                    <label>Arvioitu taso turnauksissa:</label>
                    <div className="checkbox-group">
                        <label><input type="radio" name="taso" value="a" checked={taso === 'a'} onChange={(e) => setTaso(e.target.value)} /> A</label>
                        <label><input type="radio" name="taso" value="b" checked={taso === 'b'} onChange={(e) => setTaso(e.target.value)} /> B</label>
                        <label><input type="radio" name="taso" value="c" checked={taso === 'c'} onChange={(e) => setTaso(e.target.value)} /> C</label>
                        <label><input type="radio" name="taso" value="d" checked={taso === 'd'} onChange={(e) => setTaso(e.target.value)} /> D</label>
                        <label><input type="radio" name="taso" value="e" checked={taso === 'e'} onChange={(e) => setTaso(e.target.value)} /> E</label>
                    </div>
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

                <div className="form-group">
                    <label htmlFor="password2">Salasana uudestaan:</label>
                    <input
                        type="password"
                        id="password2"
                        name="password2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Rekisteröidy</button>
            </form>
        </div>
    );
}

export default Register;