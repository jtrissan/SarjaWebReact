import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './../static/styles.css';
import Esittely from './Esittely';
import Sarjataulukko from './Sarjataulukko';
import TuloksenTallennus from './TuloksenTallennus';
import Login from './Login';
import Register from './Register';
//import AdminDashboard from './AdminDashboard';
import Logout from './Logout';

function App() {
    const [currentUser, setCurrentUser] = useState({
        isAuthenticated: false,
        admin: false,
    });

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
                <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout setCurrentUser={setCurrentUser} />} />
            </Routes>
        </Router>
    );
}

export default App;