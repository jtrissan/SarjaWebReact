import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './../static/styles.css';

function Register() {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const [nimi, setNimi] = useState('');
    const [email, setEmail] = useState('');
    const [puhelin, setPuhelin] = useState('');
    const [taso, setTaso] = useState('e');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!validateEmail(email)) {
            newErrors.email = 'Syötä kelvollinen sähköpostiosoite.';
        }

        if (password.length < 8) {
            newErrors.password = 'Salasanan on oltava vähintään 8 merkkiä pitkä.';
        }

        if (password !== password2) {
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

        const response = await fetch(`${API_URL}/register`, {
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
            setModalMessage('Rekisteröityminen onnistui');
            setModalType('success');
        } else {
            setModalMessage('Rekisteröityminen epäonnistui');
            setModalType('error');
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        if (modalType === 'success') {
            navigate('/login');
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
                        value={puhelin}
                        onChange={(e) => setPuhelin(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Arvioitu taso turnauksissa:</label>
                    <div className="checkbox-group">
                        {['a', 'b', 'c', 'd', 'e'].map((level) => (
                            <label key={level}>
                                <input
                                    type="radio"
                                    name="taso"
                                    value={level}
                                    checked={taso === level}
                                    onChange={(e) => setTaso(e.target.value)}
                                /> {level.toUpperCase()}
                            </label>
                        ))}
                    </div>
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
                    {errors.password && <p className="error-text">{errors.password}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password2">Salasana uudestaan:</label>
                    <input
                        type="password"
                        id="password2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                    {errors.password2 && <p className="error-text">{errors.password2}</p>}
                </div>

                <button type="submit">Rekisteröidy</button>
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

export default Register;
