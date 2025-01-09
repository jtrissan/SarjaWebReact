import React, { useEffect, useState } from 'react';
import './../static/styles.css';

function Sarjataulukko() {
    const [lohkot, setLohkot] = useState([]);

    useEffect(() => {
        // Hae data backendistä
        fetch('http://localhost:5000/api/sarjataulukko', {
            method: 'GET',
            credentials: 'include',  // Lisää tämä rivi
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setLohkot(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="containerL">
            <h1>Sarjataulukko</h1>
            {lohkot.length === 0 ? (
                <p>Loading...</p>
            ) : (
                lohkot.map((lohko, index) => (
                    <div key={index}>
                        <h2>Lohko {lohko.lohko_numero}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nimi</th>
                                    <th>Pisteet</th>
                                    <th>Ottelut</th>
                                    <th>Puhelin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lohko.pelaajat.map(pelaaja => (
                                    <tr key={pelaaja.id}>
                                        <td>
                                            <a href={`/player/${pelaaja.id}`}>
                                                {pelaaja.nimi}
                                            </a>
                                        </td>
                                        <td>{pelaaja.pisteet}</td>
                                        <td>{pelaaja.ottelut_maara}</td>
                                        <td>{pelaaja.puhelin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            )}
        </div>
    );
}

export default Sarjataulukko;