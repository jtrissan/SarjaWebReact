import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../static/styles.css';

function TuloksenTallennus() {
    const [sarjakierrosId, setSarjakierrosId] = useState('');
    const [lohkoId, setLohkoId] = useState('');
    const [pelaaja1Id, setPelaaja1Id] = useState('');
    const [pelaaja1Nimi, setPelaaja1Nimi] = useState('');
    const [pelaaja2Id, setPelaaja2Id] = useState('');
    const [eratulokset, setEratulokset] = useState({ era1_p1: '', era1_p2: '', era2_p1: '', era2_p2: '', era3_p1: '', era3_p2: '' });
    const [samanLohkonPelaajat, setSamanLohkonPelaajat] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Hae tiedot backendistä
        fetch('http://localhost:5000/api/lohko_pelaajat', {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setSarjakierrosId(data.sarjakierros_id);
                setLohkoId(data.lohko_id);
                setPelaaja1Id(data.pelaaja1_id);
                setSamanLohkonPelaajat(data.saman_lohkon_pelaajat);

                // Hae pelaaja 1:n nimi
                return fetch(`http://localhost:5000/api/hae_pelaaja/${data.pelaaja1_id}`, {
                    method: 'GET',
                    credentials: 'include',
                });
            })
            .then(response => response.json())
            .then(pelaajaData => {
                setPelaaja1Nimi(pelaajaData.nimi);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const validateResults = () => {
        const { era1_p1, era1_p2, era2_p1, era2_p2, era3_p1, era3_p2 } = eratulokset;

        // Tarkista, että ensimmäinen erä on aloitettu
        if ((era1_p1 === '' || era1_p2 === '') || (parseInt(era1_p1) === 0 && parseInt(era1_p2) === 0)) {
            alert('Ensimmäinen erä on aloitettava.');
            return false;
        }

        // Tarkista, että erätulokset ovat sallituissa rajoissa
        if ((parseInt(era1_p1) < 0 || parseInt(era1_p1) > 7) || (parseInt(era1_p2) < 0 || parseInt(era1_p2) > 7)) {
            alert('Ensimmäisen erän tulokset on oltava välillä 0-7.');
            return false;
        }
        if ((era2_p1 !== '' && (parseInt(era2_p1) < 0 || parseInt(era2_p1) > 7)) || (era2_p2 !== '' && (parseInt(era2_p2) < 0 || parseInt(era2_p2) > 7))) {
            alert('Toisen erän tulokset on oltava välillä 0-7.');
            return false;
        }
        if ((era3_p1 !== '' && (parseInt(era3_p1) < 0 || parseInt(era3_p1) > 30)) || (era3_p2 !== '' && (parseInt(era3_p2) < 0 || parseInt(era3_p2) > 30))) {
            alert('Kolmannen erän tulokset on oltava välillä 0-30.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateResults()) {
            return;
        }

        const response = await fetch('http://localhost:5000/api/ottelut', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                sarjakierros_id: sarjakierrosId,
                lohko_id: lohkoId,
                pelaaja1_id: pelaaja1Id,
                pelaaja2_id: pelaaja2Id,
                eratulokset: {
                    era1_p1: eratulokset.era1_p1,
                    era1_p2: eratulokset.era1_p2,
                    era2_p1: eratulokset.era2_p1,
                    era2_p2: eratulokset.era2_p2,
                    era3_p1: eratulokset.era3_p1,
                    era3_p2: eratulokset.era3_p2,
                },
            }),
        });

        if (response.ok) {
            alert('Ottelutulos tallennettu onnistuneesti');
            navigate('/sarjataulukko');
        } else {
            alert('Ottelutuloksen tallennus epäonnistui');
        }
    };

    const handleEratuloksetChange = (e) => {
        const { name, value } = e.target;
        setEratulokset(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="containerS">
            <h1>Ottelutuloksen tallennus</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="sarjakierrosId">Sarjakierros: {sarjakierrosId}</label>
                </div>

                <div className="form-group">
                    <label htmlFor="lohkoId">Lohkonumero: {lohkoId}</label>
                </div>

                <div className="form-group">
                    <label htmlFor="pelaaja1Nimi">Pelaaja 1:</label>
                    <input
                        type="text"
                        id="pelaaja1Nimi"
                        value={pelaaja1Nimi}
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="pelaaja2Id">Pelaaja 2:</label>
                    <select
                        id="pelaaja2Id"
                        value={pelaaja2Id}
                        onChange={(e) => setPelaaja2Id(e.target.value)}
                        required
                    >
                        <option value="" disabled>Valitse vastustaja</option>
                        {samanLohkonPelaajat.map(pelaaja => (
                            <option key={pelaaja.id} value={pelaaja.id}>
                                {pelaaja.nimi}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <table>
                        <thead>
                            <tr>
                                <td>Erätulokset:</td>
                                <th>Pelaaja 1</th>
                                <th>Pelaaja 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><label htmlFor="era1_p1">1. erä</label></td>
                                <td><input type="number" id="era1_p1" name="era1_p1" min="0" max="7" value={eratulokset.era1_p1} onChange={handleEratuloksetChange} required /></td>
                                <td><input type="number" id="era1_p2" name="era1_p2" min="0" max="7" value={eratulokset.era1_p2} onChange={handleEratuloksetChange} required /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="era2_p1">2. erä, jos aloitettu</label></td>
                                <td><input type="number" id="era2_p1" name="era2_p1" min="0" max="7" value={eratulokset.era2_p1} onChange={handleEratuloksetChange} /></td>
                                <td><input type="number" id="era2_p2" name="era2_p2" min="0" max="7" value={eratulokset.era2_p2} onChange={handleEratuloksetChange} /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="era3_p1">3. erä, jos aloitettu</label></td>
                                <td><input type="number" id="era3_p1" name="era3_p1" min="0" max="30" value={eratulokset.era3_p1} onChange={handleEratuloksetChange} /></td>
                                <td><input type="number" id="era3_p2" name="era3_p2" min="0" max="30" value={eratulokset.era3_p2} onChange={handleEratuloksetChange} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <button type="submit">Lähetä tulokset</button>
            </form>
        </div>
    );
}

export default TuloksenTallennus;