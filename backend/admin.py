from flask import Blueprint, render_template, request, flash, redirect, url_for, current_app
from flask_login import login_required
from . import db
from .models import Pelaaja, Sarjakierros, LohkojenPelaajat
from .services import hae_pelaajan_tiedot, jaa_pelaajat_uudelle_kierrokselle
from werkzeug.security import generate_password_hash
import os

admin = Blueprint('admin', __name__)

# Pääsivu
@admin.route('/')
@login_required
def admin_dashboard():
    react_app_url = current_app.config['REACT_APP_URL']
    return render_template('admin.html', react_app_url=react_app_url)

# Pelaajien hallinta

@admin.route('/edit_player/<int:pelaaja_id>', methods=['GET', 'POST'])
@login_required
def hae_pelaaja(pelaaja_id):
    pelaaja = hae_pelaajan_tiedot(pelaaja_id)

    if request.method == 'POST':
        nimi = request.form.get('nimi')
        email = request.form.get('email')
        puhelin = request.form.get('puhelin')
        aktiivinen = request.form.get('aktiivisuus') == 'True'
        taso = request.form.get('taso')
        admin = request.form.get('admin') == 'True'
        password = request.form.get('password')

        if len(email) < 4:
            flash('Email must be at least 3 characters.', category='error')
        elif len(nimi) < 2:
            flash('Name must at least 2 charactes.', category='error')
        elif password and len(password) < 7:
            flash('Password must be at least 7 characters.', category='error')
        else:
            pelaaja.nimi = nimi
            pelaaja.email = email
            pelaaja.puhelin = puhelin
            pelaaja.aktiivinen = aktiivinen
            pelaaja.admin = admin
            pelaaja.taso = taso
            if password:
                pelaaja.password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)

            db.session.commit()
            flash('Player has been updated!', category='success')
            return redirect(url_for('admin.players'))
    
    return render_template('edit_player.html', pelaaja=pelaaja)

@admin.route('/add_player', methods=['GET', 'POST'])
@login_required
def add_player():
    if request.method == 'POST':
        nimi = request.form.get('nimi')
        email = request.form.get('email')
        puhelin = request.form.get('puhelin')
        taso = request.form.get('taso')
        aktiivinen = request.form.get('aktiivinen')
        admin = request.form.get('admin')
        password = request.form.get('password')

        uusi_pelaaja = Pelaaja(nimi=nimi, email=email, puhelin=puhelin, taso=taso, 
                               aktiivinen=aktiivinen, admin=admin, password=password)
        db.session.add(uusi_pelaaja)
        db.session.commit()
        flash('Pelaaja lisätty onnistuneesti!', 'success')
        return redirect(url_for('admin.players'))

    return render_template('add_player.html')

@admin.route('/edit_player/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_player(id):
    pelaaja = Pelaaja.query.get_or_404(id)
    if request.method == 'POST':
        pelaaja.nimi = request.form.get('nimi')
        pelaaja.email = request.form.get('email')
        pelaaja.puhelin = request.form.get('puhelin')
        pelaaja.taso = request.form.get('taso')
        db.session.commit()
        flash('Pelaajan tiedot päivitetty onnistuneesti!', 'success')
        return redirect(url_for('admin.players'))

    return render_template('edit_player.html', pelaaja=pelaaja)

@admin.route('/delete_player/<int:id>', methods=['POST'])
@login_required
def delete_player(id):
    pelaaja = Pelaaja.query.get_or_404(id)
    db.session.delete(pelaaja)
    db.session.commit()
    flash('Pelaaja poistettu onnistuneesti!', 'success')
    return redirect(url_for('admin.players'))

@admin.route('/players', methods=['GET', 'POST'])
@login_required
def players():
    pelaajat = Pelaaja.query.all()
    return render_template('playerlist.html', pelaajat=pelaajat)

@admin.route('/jaa-lohkot-uudelle-kierrokselle', methods=['POST'])
@login_required
def jaa_lohkot_uudelle_kierrokselle():
    jaa_pelaajat_uudelle_kierrokselle()
    flash("Lohkojako tallennettu uudelle kierrokselle.", "success")
    return redirect(url_for('admin.sarjataulukko'))

@admin.route('/lohkojako')
@login_required
def lohkojako():
    # Hae uusin sarjakierros
    uusin_sarjakierros = Sarjakierros.query.order_by(Sarjakierros.kierros_numero.desc()).first()
    sarjakierros_id = uusin_sarjakierros.id

    # Hae lohkojen pelaajat ja pisteet
    lohkot = LohkojenPelaajat.query.filter_by(sarjakierros_id=sarjakierros_id).all()

    # Järjestä lohkot lohkon numeron mukaan
    lohkot_jarjestetty = {}
    for lohko in lohkot:
        if lohko.lohko_numero not in lohkot_jarjestetty:
            lohkot_jarjestetty[lohko.lohko_numero] = []
        lohkot_jarjestetty[lohko.lohko_numero].append(lohko)

    # Järjestä pelaajat pisteiden mukaan
    for lohko_numero in lohkot_jarjestetty:
        lohkot_jarjestetty[lohko_numero].sort(key=lambda x: x.pisteet, reverse=True)

    # Hae aktiiviset pelaajat, jotka eivät ole mukana viimeisimmässä sarjakierroksessa
    aktiiviset_pelaajat = Pelaaja.query.filter_by(aktiivinen=True).all()
    mukana_olevat_pelaajat = {lohko.pelaaja_id for lohko in lohkot}
    uudet_pelaajat = [pelaaja for pelaaja in aktiiviset_pelaajat if pelaaja.id not in mukana_olevat_pelaajat]

    return render_template('lohkojako.html', lohkot=lohkot_jarjestetty, uudet_pelaajat=uudet_pelaajat, enumerate=enumerate)

# Sarjataulukko
@admin.route('/sarjataulukko')
@login_required
def sarjataulukko():
    # Hae uusin sarjakierros
    uusin_sarjakierros = Sarjakierros.query.order_by(Sarjakierros.kierros_numero.desc()).first()
    sarjakierros_id = uusin_sarjakierros.id

    # Hae lohkojen pelaajat ja pisteet
    lohkot = LohkojenPelaajat.query.filter_by(sarjakierros_id=sarjakierros_id).all()

    # Järjestä lohkot lohkon numeron mukaan
    lohkot_jarjestetty = {}
    for lohko in lohkot:
        if lohko.lohko_numero not in lohkot_jarjestetty:
            lohkot_jarjestetty[lohko.lohko_numero] = []
        lohkot_jarjestetty[lohko.lohko_numero].append(lohko)

    # Järjestä pelaajat pisteiden mukaan
    for lohko_numero in lohkot_jarjestetty:
        lohkot_jarjestetty[lohko_numero].sort(key=lambda x: x.pisteet, reverse=True)

    return render_template('sarjataulukko.html', lohkot=lohkot_jarjestetty)
