import os
import rollbar
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from pathlib import Path

db = SQLAlchemy()

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    SECRET_KEY = os.getenv('SECRET_KEY_DEV')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL_DEV')
    FLASK_ENV = os.getenv('FLASK_ENV_DEV')
    ROLLBAR_TOKEN = os.getenv('ROLLBAR_TOKEN_DEV')

    print("jbhgrgfdbhfd", os.getenv('DATABASE_URL_DEV'))

    DEBUG = True
    ROLLBAR = {
        'access_token': ROLLBAR_TOKEN,
        'environment': 'development',
        'root': os.path.dirname(os.path.realpath(__file__)),
        'allow_logging_basic_config': False,
        'code_version': 'v1.0.0'
    }

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        
        with app.app_context():
            if cls.ROLLBAR['access_token']:
                rollbar.init(**app.config['ROLLBAR'])


class ProductionConfig(Config):
    SECRET_KEY = os.getenv('SECRET_KEY_PROD')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL_PROD')
    FLASK_ENV = os.getenv('FLASK_ENV_PROD')
    ROLLBAR_TOKEN = os.getenv('ROLLBAR_TOKEN_PROD')

    DEBUG = False
    ROLLBAR = {
        'access_token': ROLLBAR_TOKEN,
        'environment': 'production',
        'root': os.path.dirname(os.path.realpath(__file__)),
        'allow_logging_basic_config': False,
    }

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)

        if cls.ROLLBAR['access_token']:
            rollbar.init(
                cls.ROLLBAR['access_token'],
                cls.ROLLBAR['environment'],
                root=cls.ROLLBAR['root'],
                allow_logging_basic_config=cls.ROLLBAR['allow_logging_basic_config']
            )

            with app.app_context():
                if cls.ROLLBAR['access_token']:
                    rollbar.init(**app.config['ROLLBAR'])