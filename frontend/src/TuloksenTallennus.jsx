import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './../static/styles.css';

function TuloksenTallennus() {
    const [sarjakierrosId, setSarjakierrosId] = useState('');
    const [lohkoId, setLohkoId] = useState('');
    const [pelaaja1Id, setPelaaja1Id] = useState('');
    const [pelaaja1Nimi, setPelaaja1Nimi] = useState('');
    const [pelaaja2Id, setPelaaja2Id] = useState('');
    const [eratulokset, setEratulokset] = useState({ era1_p1: '', era1_p2: '', era2_p1: '', era2_p2: '', era3_p1: '', era3_p2: '' });
    const [samanLohkonPelaajat, setSamanLohkonPelaajat] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/lohko_pelaajat', { method: 'GET', credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                setSarjakierrosId(data.sarjakierros_id);
                setLohkoId(data.lohko_id);
                setPelaaja1Id(data.pelaaja1_id);
                setSamanLohkonPelaajat(data.saman_lohkon_pelaajat);
                return fetch(`http://localhost:5000/api/hae_pelaaja/${data.pelaaja1_id}`, { method: 'GET', credentials: 'include' });
            })
            .then(response => response.json())
            .then(pelaajaData => setPelaaja1Nimi(pelaajaData.nimi))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const validateResults = () => {
        const newErrors = {};
        const { era1_p1, era1_p2, era2_p1, era2_p2, era3_p1, era3_p2 } = eratulokset;

        if (!era1_p1 || !era1_p2 || (parseInt(era1_p1) === 0 && parseInt(era1_p2) === 0)) {
            newErrors.era1_p1 = 'Ensimmäinen erä on aloitettava.';
            newErrors.era1_p2 = 'Ensimmäinen erä on aloitettava.';
        }

        if ((parseInt(era1_p1) < 0 || parseInt(era1_p1) > 7) || (parseInt(era1_p2) < 0 || parseInt(era1_p2) > 7)) {
            newErrors.era1_p1 = 'Ensimmäisen erän tulos pitää olla välillä 0-7.';
            newErrors.era1_p2 = 'Ensimmäisen erän tulos pitää olla välillä 0-7.';
        }

        if ((era2_p1 && (parseInt(era2_p1) < 0 || parseInt(era2_p1) > 7)) || (era2_p2 && (parseInt(era2_p2) < 0 || parseInt(era2_p2) > 7))) {
            newErrors.era2_p1 = 'Toisen erän tulos pitää olla välillä 0-7.';
            newErrors.era2_p2 = 'Toisen erän tulos pitää olla välillä 0-7.';
        }

        if ((era3_p1 && (parseInt(era3_p1) < 0 || parseInt(era3_p1) > 30)) || (era3_p2 && (parseInt(era3_p2) < 0 || parseInt(era3_p2) > 30))) {
            newErrors.era3_p1 = 'Kolmannen erän tulos pitää olla välillä 0-30.';
            newErrors.era3_p2 = 'Kolmannen erän tulos pitää olla välillä 0-30.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateResults()) {
            return;
        }

        const response = await fetch('http://localhost:5000/api/ottelut', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                sarjakierros_id: sarjakierrosId,
                lohko_id: lohkoId,
                pelaaja1_id: pelaaja1Id,
                pelaaja2_id: pelaaja2Id,
                eratulokset
            }),
        });

        if (response.ok) {
            setModalMessage('Ottelutulos tallennettu onnistuneesti');
            setModalType('success');
        } else {
            setModalMessage('Ottelutuloksen tallennus epäonnistui');
            setModalType('error');
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        if (modalType === 'success') {
            navigate('/sarjataulukko');
        }
    };

    const handleEratuloksetChange = (e) => {
        const { name, value } = e.target;
        setEratulokset(prevState => ({ ...prevState, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Poistaa virheilmoituksen kun käyttäjä korjaa syötteen
    };

    return (
        <div className="containerS">
            <h1>Ottelutuloksen tallennus</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Pelaaja 1: {pelaaja1Nimi}</label>
                </div>

                <div className="form-group">
                    <label>Pelaaja 2:</label>
                    <select value={pelaaja2Id} onChange={(e) => setPelaaja2Id(e.target.value)} required>
                        <option value="" disabled>Valitse vastustaja</option>
                        {samanLohkonPelaajat.map(pelaaja => (
                            <option key={pelaaja.id} value={pelaaja.id}>{pelaaja.nimi}</option>
                        ))}
                    </select>
                </div>

                <table>
                    <thead>
                        <tr>
                            <td>Erätulokset:</td>
                            <th>Pelaaja 1</th>
                            <th>Pelaaja 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {['era1', 'era2', 'era3'].map((era, index) => (
                            <tr key={era}>
                                <td><label>{index + 1}. erä</label></td>
                                <td>
                                    <input type="number" name={`${era}_p1`} value={eratulokset[`${era}_p1`]} onChange={handleEratuloksetChange} required={index === 0} />
                                    {errors[`${era}_p1`] && <p className="error-text">{errors[`${era}_p1`]}</p>}
                                </td>
                                <td>
                                    <input type="number" name={`${era}_p2`} value={eratulokset[`${era}_p2`]} onChange={handleEratuloksetChange} required={index === 0} />
                                    {errors[`${era}_p2`] && <p className="error-text">{errors[`${era}_p2`]}</p>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="submit">Lähetä tulokset</button>
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

export default TuloksenTallennus;
