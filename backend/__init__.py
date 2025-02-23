# This file makes the directory a package

# You can import modules or initialize package-level variables here
# For example:
# from .module_name import some_function

# Initialize package-level variables if needed
# variable_name = value

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path, environ
from flask_login import LoginManager
from flask_cors import CORS
from dotenv import load_dotenv

# Lataa ympäristömuuttujat .env-tiedostosta
load_dotenv()

db = SQLAlchemy()
DB_NAME = "tennissarja.db"

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = environ.get('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL', f'sqlite:///{DB_NAME}')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['REACT_APP_URL'] = environ.get('REACT_APP_URL')
    #CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    CORS(app, supports_credentials=True, origins=environ.get('CORS_ALLOWED_ORIGIN'))
    db.init_app(app)


    from .models import Pelaaja

    with app.app_context():
        db.create_all()

    from .admin import admin
    from .auth import auth
    from .player import player
    from .api import api # Reactin käyttämä API

    # Register blueprints
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/')
    from .player import player as player_blueprint
    app.register_blueprint(player_blueprint, url_prefix='/')
    from .admin import admin as admin_blueprint
    app.register_blueprint(admin_blueprint, url_prefix='/admin')
    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return Pelaaja.query.get(int(id))

    print("TESTING! TESTING! TESTING!")
    print(app.url_map)
    return app

def create_database(app):
    if not path.exists('SarjaWebReact/' + DB_NAME):
        with app.app_context():
            db.create_all()
        print('Created Database!')

