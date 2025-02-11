import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './../static/styles.css';

function UpdateProfile() {
    const [nimi, setNimi] = useState('');
    const [email, setEmail] = useState('');
    const [puhelin, setPuhelin] = useState('');
    const [aktiivisuus, setAktiivisuus] = useState(true);
    const [taso, setTaso] = useState('a');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');

    useEffect(() => {
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

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!validateEmail(email)) {
            newErrors.email = 'Syötä kelvollinen sähköpostiosoite.';
        }

        if (password && password.length < 8) {
            newErrors.password = 'Salasanan on oltava vähintään 8 merkkiä pitkä.';
        }

        if (password && password !== password2) {
            newErrors.password2 = 'Salasanat eivät täsmää.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
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
            setModalMessage('Tiedot päivitetty onnistuneesti');
            setModalType('success');
        } else {
            setModalMessage('Tietojen päivitys epäonnistui');
            setModalType('error');
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        if (modalType === 'success') {
            navigate('/');
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
                    {errors.email && <p className="error-text">{errors.email}</p>}
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
                    <label htmlFor="taso">Arvioitu taso turnauksissa:</label>
                    <div className="checkbox-group">
                        {['a', 'b', 'c', 'd', 'e'].map(level => (
                            <label key={level}>
                                <input
                                    type="radio"
                                    name="taso"
                                    value={level}
                                    checked={taso === level}
                                    onChange={() => setTaso(level)}
                                />
                                {level.toUpperCase()}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Uusi salasana (jätä tyhjäksi, jos et halua vaihtaa):</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
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
                    {errors.password2 && <p className="error-text">{errors.password2}</p>}
                </div>

                <button type="submit">Päivitä tiedot</button>
            </form>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Ilmoitus"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>{modalMessage}</h2>
                <button onClick={closeModal}>OK</button>
            </Modal>
            
        </div>
    );
}

export default UpdateProfile;
