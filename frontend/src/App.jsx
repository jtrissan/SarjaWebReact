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
    const [currentUser, setCurrentUser] = useState({ isAuthenticated: false, admin: false });

    useEffect(() => {
        // Hae käyttäjän tiedot backendistä
        fetch('http://localhost:5000/api/current_user', {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.isAuthenticated) {
                    setCurrentUser({ isAuthenticated: true, admin: data.admin });
                }
            })
            .catch(error => console.error('Error fetching current user data:', error));
    }, []);

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
                    <a href="http://localhost:5000/admin">Ylläpito</a>
                )}
            </div>
            <Routes>
                <Route path="/" element={<Esittely />} />
                <Route path="/sarjataulukko" element={<Sarjataulukko />} />
                <Route path="/tuloksentallennus" element={<TuloksenTallennus />} />
                <Route path="/update_profile" element={<UpdateProfile />} />
                <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/player/:pelaajaId" element={<PlayerDetails />} />
                <Route path="/logout" element={<Logout setCurrentUser={setCurrentUser} />} />
            </Routes>
        </Router>
    );
}

export default App;