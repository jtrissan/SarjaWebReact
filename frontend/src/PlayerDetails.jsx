import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PlayerDetails({ API_URL }) {
    const { pelaajaId } = useParams();
    const [pelaaja, setPelaaja] = useState(null);
    const [ottelut, setOttelut] = useState([]);
    const [tilastot, setTilastot] = useState({ voitot: 0, tappiot: 0, tasapelit: 0, pisteet: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        // Hae pelaajan tiedot
        fetch(`${API_URL}/hae_pelaaja/${pelaajaId}`, {
            credentials: 'include'
        })
            .then(response => {
                if (response.redirected) {
                    navigate('/login');
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setPelaaja(data);
                }
            })
            .catch(error => console.error('Error fetching player data:', error));

        // Hae pelaajan ottelut
        fetch(`${API_URL}/hae_pelaajan_ottelut/${pelaajaId}`, {
            credentials: 'include'
        })
            .then(response => {
                if (response.redirected) {
                    navigate('/login');
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setOttelut(data);
                    laskeTilastot(data);
                }
            })
            .catch(error => console.error('Error fetching match data:', error));
    }, [pelaajaId, navigate]);

    const laskeTilastot = (ottelut) => {
        let voitot = 0;
        let tappiot = 0;
        let tasapelit = 0;
        let pisteet = 0;
        let ottelumaara = 0;

        ottelut.forEach(ottelu => {
            if (ottelu.p1_pisteet > ottelu.p2_pisteet) {
                voitot++;
            } else if (ottelu.p1_pisteet < ottelu.p2_pisteet) {
                tappiot++;
            } else {
                tasapelit++;
            }
            pisteet += ottelu.p1_pisteet;
            ottelumaara++;
        });

        setTilastot({ ottelumaara, voitot, tappiot, tasapelit, pisteet });
    };

    if (!pelaaja) {
        return <div>Loading...</div>;
    }

    return (
        <div className="containerL">
            <h1>{pelaaja.nimi}</h1>
            <p>Puhelin: {pelaaja.puhelin}</p>
            <p>Email: {pelaaja.email}</p>
            <p>Taso: {pelaaja.taso}</p>

            <h2>Tilastot</h2>
            <table>
                <thead>
                    <tr>
                        <th>Ottelut</th>
                        <th>Voitot</th>
                        <th>Tappiot</th>
                        <th>Tasapelit</th>
                        <th>Pisteet</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{tilastot.ottelumaara}</td>
                        <td>{tilastot.voitot}</td>
                        <td>{tilastot.tappiot}</td>
                        <td>{tilastot.tasapelit}</td>
                        <td>{tilastot.pisteet}</td>
                    </tr>
                </tbody>
            </table>    

            <h2>Ottelut</h2>
            <table>
                <thead>
                    <tr>
                        <th>Vastustaja</th>
                        <th>Kierros</th>
                        <th>Lohko</th>
                        <th>1.erä</th>
                        <th>2.erä</th>
                        <th>3.erä</th>
                        <th>Pisteet</th>
                    </tr>
                </thead>
                <tbody>
                    {ottelut.map(ottelu => (
                        <tr key={ottelu.id}>
                            <td><a href={`/player/${ottelu.vastustaja.id}`}>{ottelu.vastustaja.nimi}</a></td>
                            <td>{ottelu.kierros_numero}</td>
                            <td>{ottelu.lohko_numero}</td>
                            <td>{ottelu.era1_p1} - {ottelu.era1_p2}</td>
                            <td>{ottelu.era2_p1} - {ottelu.era2_p2}</td>
                            <td>{ottelu.era3_p1} - {ottelu.era3_p2}</td>
                            <td>{ottelu.p1_pisteet} - {ottelu.p2_pisteet}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PlayerDetails;