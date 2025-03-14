import React from 'react';
import './../static/styles.css';

function Esittely() {
    return (
        
        <div className="containerL">
        <h1>Tervetuloa avoimen tennissarjan kotisivulle!</h1>

        <p>Tämä sarja on tarkoitettu kaiken tasoisille pelaajille, jotka haluavat kilpailla 
        ja pitää hauskaa tenniksen parissa. Voit pelata missä ja milloin sinulle ja 
        vastustajallesi sopii.
        </p>
        <br />
        <p>Sarja on jaettu pelaajien tason mukaan lohkoihin, joissa pelaajat pelaavat keskenään 
        sarjakierroksen aikana yhden ottelun jokaista muuta lohkon pelaajaa vastaan. Yksi jakso 
        kestää noin kuusi viikkoa, jonka aikana sinulle tulee 3-5 ottelua.</p>
        <br />

        <p>Pelaajat sopivat keskenään ottelujen paikan ja ajankohdan, sekä varaavat kentän. 
        Ottelun tuloksen he tallentavat tälle sivustolle, josta se päivittyy automaattiseen 
        tulosjärjestelmään ja sarjataulukkoon.</p>
        <br />
        <p>
        Voit ilmoittautua sarjaan milloin vain täyttämällä tietosi ilmoittautumislomakkeelle. 
        Sinut sijoitetaan pelitaitosi mukaan sopivaan lohkoon seuraavalle sarjakierrokselle.
        </p>
    </div>
    );
}

export default Esittely;
