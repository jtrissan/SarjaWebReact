import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ setCurrentUser }) {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    setCurrentUser({ isAuthenticated: false, admin: false });
                    navigate('/');
                } else {
                    alert('Uloskirjautuminen epäonnistui');
                }
            })
            .catch(error => console.error('Error logging out:', error));
    }, [navigate, setCurrentUser]);

    return <div>Kirjaudutaan ulos...</div>;
}

export default Logout;