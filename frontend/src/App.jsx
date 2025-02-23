import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './../static/styles.css';
import Esittely from './Esittely';
import Sarjataulukko from './Sarjataulukko';
import TuloksenTallennus from './TuloksenTallennus';
import Login from './Login';
import Register from './Register';
import Logout from './Logout';
import PlayerDetails from './PlayerDetails';
import UpdateProfile from './UpdateProfile';

function App() {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const FLASK_UI_URL = import.meta.env.VITE_FLASK_UI_URL || "http://localhost:5000";
    //const API_URL = "http://localhost:5000/api";
    //const FLASK_UI_URL = "http://localhost:5000";
    const [currentUser, setCurrentUser] = useState({ isAuthenticated: false, admin: false });

    useEffect(() => {
        // Hae käyttäjän tiedot backendistä
        fetch(`${API_URL}/current_user`, {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.isAuthenticated) {
                    setCurrentUser({ isAuthenticated: true, admin: data.admin });
                }
            })
            .catch(error => console.error('Error fetching current user data:', error));
    }, [API_URL]);

    return (
        <Router>
            <div className="header">
                <Link to="/">Esittely</Link>
                {currentUser.isAuthenticated && (
                    <Link to="/sarjataulukko">Sarjataulukko</Link>
                )}
                {currentUser.isAuthenticated && (
                    <Link to="/tuloksentallennus">Tuloksen tallennus</Link>
                )}
                {currentUser.isAuthenticated && (
                    <Link to="/update_profile">Päivitä tiedot</Link>
                )}
                {!currentUser.isAuthenticated && (
                    <Link to="/login">Kirjaudu sisään</Link>
                )}
                {!currentUser.isAuthenticated && (
                    <Link to="/register">Rekisteröidy</Link>
                )}
                {currentUser.isAuthenticated && (
                    <Link to="/logout">Kirjaudu ulos</Link>
                )}
                {currentUser.isAuthenticated && currentUser.admin && (
                    <a href={`${FLASK_UI_URL}/admin`}>Ylläpito</a>
                )}
            </div>
            <Routes>
                <Route path="/" element={<Esittely />} />
                <Route path="/sarjataulukko" element={<Sarjataulukko API_URL={API_URL} />} />
                <Route path="/tuloksentallennus" element={<TuloksenTallennus API_URL={API_URL} />} />
                <Route path="/update_profile" element={<UpdateProfile API_URL={API_URL} />} />
                <Route path="/login" element={<Login API_URL={API_URL} setCurrentUser={setCurrentUser} />} />
                <Route path="/register" element={<Register API_URL={API_URL} />} />
                <Route path="/player/:pelaajaId" element={<PlayerDetails API_URL={API_URL} />} />
                <Route path="/logout" element={<Logout API_URL={API_URL} setCurrentUser={setCurrentUser} />} />
            </Routes>
        </Router>
    );
}

export default App;