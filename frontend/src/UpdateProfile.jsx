import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../static/styles.css';

function UpdateProfile() {
    const [nimi, setNimi] = useState('');
    const [email, setEmail] = useState('');
    const [puhelin, setPuhelin] = useState('');
    const [aktiivisuus, setAktiivisuus] = useState(true);
    const [taso, setTaso] = useState('a');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Hae nykyisen käyttäjän tiedot
        fetch('http://localhost:5000/api/current_user', {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setNimi(data.nimi);
                setEmail(data.email);
                setPuhelin(data.puhelin);
                setAktiivisuus(data.aktiivinen);
                setTaso(data.taso);
            })
            .catch(error => console.error('Error fetching current user data:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            alert('Salasanat eivät täsmää');
            return;
        }

        const response = await fetch('http://localhost:5000/api/update_profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                nimi,
                email,
                puhelin,
                aktiivisuus,
                taso,
                password,
            }),
        });

        if (response.ok) {
            alert('Tiedot päivitetty onnistuneesti');
            navigate('/');
        } else {
            alert('Tietojen päivitys epäonnistui');
        }
    };

    return (
        <div className="containerS">
            <h1>Tietojen päivitys</h1>
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
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="radio"
                                name="aktiivisuus"
                                value="True"
                                checked={aktiivisuus === true}
                                onChange={() => setAktiivisuus(true)}
                            />
                            Aktiivinen
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="aktiivisuus"
                                value="False"
                                checked={aktiivisuus === false}
                                onChange={() => setAktiivisuus(false)}
                            />
                            Tauolla
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label for="taso">Arvioitu taso turnauksissa:</label>
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="radio"
                                name="taso"
                                value="a"
                                checked={taso === 'a'}
                                onChange={() => setTaso('a')}
                            />
                            A
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="taso"
                                value="b"
                                checked={taso === 'b'}
                                onChange={() => setTaso('b')}
                            />
                            B
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="taso"
                                value="c"
                                checked={taso === 'c'}
                                onChange={() => setTaso('c')}
                            />
                            C
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="taso"
                                value="d"
                                checked={taso === 'd'}
                                onChange={() => setTaso('d')}
                            />
                            D
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="taso"
                                value="e"
                                checked={taso === 'e'}
                                onChange={() => setTaso('e')}
                            />
                            E
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Uusi salasana:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    />
                </div>

                <button type="submit">Päivitä tiedot</button>
            </form>
        </div>
    );
}

export default UpdateProfile;