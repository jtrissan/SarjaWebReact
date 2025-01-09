import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ setCurrentUser }) {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            const response = await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setCurrentUser({
                    isAuthenticated: false,
                    admin: false,
                });
                navigate('/login');
            } else {
                alert('Uloskirjautuminen epäonnistui');
            }
        };

        logout();
    }, [navigate, setCurrentUser]);

    return <div>Kirjaudutaan ulos...</div>;
}

export default Logout;