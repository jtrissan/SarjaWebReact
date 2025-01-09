# API:n määrittelyt ja reitit
# Tässä tiedostossa määritellään API:n reitit ja niiden toiminnallisuudet.

from flask import Blueprint, jsonify, request 
from .models import Pelaaja, LohkojenPelaajat, Sarjakierros, Ottelu, db
from sqlalchemy.exc import IntegrityError
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from . import db

api = Blueprint('api', __name__)

# Tarkista, että API on käynnissä
@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'API is running'}), 200

# Hae kaikki pelaajat
@api.route('/pelaajat', methods=['GET'])
def get_pelaajat():
    pelaajat = Pelaaja.query.all()
    pelaajat_data = [
        {'id': p.id, 'nimi': p.nimi, 'email': p.email, 'taso': p.taso, 'puhelin': p.puhelin} 
        for p in pelaajat
    ]
    return jsonify(pelaajat_data), 200

# Lisää uusi pelaaja
@api.route('/register', methods=['POST'])
def add_pelaaja():
    data = request.json
    uusi_pelaaja = Pelaaja(
        nimi=data['nimi'],
        email=data['email'],
        taso=data['taso'],
        puhelin=data['puhelin'],
        password=generate_password_hash(data['password'], method='pbkdf2:sha256')
    )
    try:
        db.session.add(uusi_pelaaja)
        db.session.commit()
        return jsonify({'message': 'Pelaaja lisätty'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Sähköpostiosoite on jo käytössä'}), 400

# Hae pelaajan tiedot
@api.route('/pelaajat/<int:id>', methods=['GET'])
def get_pelaaja(id):
    pelaaja = Pelaaja.query.get(id)
    if pelaaja:
        return jsonify({
            'id': pelaaja.id, 
            'nimi': pelaaja.nimi, 
            'email': pelaaja.email, 
            'taso': pelaaja.taso, 
            'puhelin': pelaaja.puhelin
        }), 200
    else:
        return jsonify({'error': 'Pelaajaa ei löytynyt'}), 404

# Päivitä pelaajan tiedot
@api.route('/pelaajat/<int:id>', methods=['PUT']) 
def update_pelaaja(id):
    data = request.json
    pelaaja = Pelaaja.query.get(id)
    if pelaaja:
        pelaaja.nimi = data['nimi']
        pelaaja.email = data['email']
        pelaaja.taso = data['taso']
        pelaaja.puhelin = data['puhelin']
        db.session.commit()
        return jsonify({'message': 'Pelaaja päivitetty'}), 200
    else:
        return jsonify({'error': 'Pelaajaa ei löytynyt'}), 404

# Kirjaudu sisään
@api.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    pelaaja = Pelaaja.query.filter_by(email=email).first()

    if pelaaja and check_password_hash(pelaaja.password, password):
        login_user(pelaaja)
        return jsonify({'message': 'Kirjautuminen onnistui', 'admin': pelaaja.admin}), 200
    else:
        return jsonify({'error': 'Virheellinen sähköposti tai salasana'}), 401

# Kirjaudu ulos
@api.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    response = jsonify({'message': 'Uloskirjautuminen onnistui'})
    #response.headers['Access-Control-Allow-Credentials'] = 'true'  # Korjaa tämä rivi
    return response, 200

# Hae sarjataulukko
@api.route('/sarjataulukko', methods=['GET'])
@login_required
def get_sarjataulukko():
    try:
        # Hae uusin sarjakierros
        uusin_sarjakierros = Sarjakierros.query.order_by(Sarjakierros.kierros_numero.desc()).first()
        if not uusin_sarjakierros:
            return jsonify({'error': 'Sarjakierrosta ei löytynyt'}), 404

        sarjakierros_id = uusin_sarjakierros.id

        # Hae lohkojen pelaajat ja pisteet
        lohkot = LohkojenPelaajat.query.filter_by(sarjakierros_id=sarjakierros_id).all()

        # Järjestä lohkot lohkon numeron mukaan
        lohkot_jarjestetty = {}
        for lohko in lohkot:
            if lohko.lohko_numero not in lohkot_jarjestetty:
                lohkot_jarjestetty[lohko.lohko_numero] = []
            lohkot_jarjestetty[lohko.lohko_numero].append(lohko)

        result = []
        for lohko_numero in lohkot_jarjestetty:
            pelaajat = []
            for pelaaja in lohkot_jarjestetty[lohko_numero]:
                ottelut_maara = Ottelu.query.filter(
                    ((Ottelu.pelaaja1_id == pelaaja.pelaaja_id) | (Ottelu.pelaaja2_id == pelaaja.pelaaja_id)),
                    Ottelu.sarjakierros_id == sarjakierros_id,
                    Ottelu.lohko_numero == lohko_numero
                ).count()
                pelaajat.append({
                    'id': pelaaja.pelaaja.id,
                    'nimi': pelaaja.pelaaja.nimi,
                    'puhelin': pelaaja.pelaaja.puhelin,
                    'pisteet': pelaaja.pisteet,
                    'ottelut_maara': ottelut_maara
                })
            pelaajat.sort(key=lambda x: x['pisteet'], reverse=True)
            result.append({
                'lohko_numero': lohko_numero,
                'pelaajat': pelaajat
            })

        response = jsonify(result)
        #response.headers['Access-Control-Allow-Credentials'] = 'true'  # Korjaa tämä rivi
        return response, 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

# Luo uusi sarjakierros
@api.route('/kierrokset', methods=['POST'])
def luo_uusi_kierros():
    data = request.json
    uusi_kierros = Sarjakierros(kausi_id=data['kausi_id'])
    db.session.add(uusi_kierros)
    db.session.commit()
    return jsonify({'message': 'Uusi sarjakierros luotu', 'id': uusi_kierros.id}), 201

# Tallenna ottelutulos
@api.route('/ottelut', methods=['POST'])
def tallenna_ottelu():
    data = request.json
    uusi_ottelu = Ottelu(
        sarjakierros_id=data['sarjakierros_id'],
        lohko_id=data['lohko_id'],
        pelaaja1_id=data['pelaaja1_id'],
        pelaaja2_id=data['pelaaja2_id'],
        eratulokset=data['eratulokset']  # JSON-kenttä sisältää erien pisteet
    )
    db.session.add(uusi_ottelu)
    db.session.commit()
    return jsonify({'message': 'Ottelutulos tallennettu'}), 201