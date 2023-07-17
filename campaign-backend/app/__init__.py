import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from pathlib import Path
from .config import Config, DevelopmentConfig, ProductionConfig

db = SQLAlchemy()

def create_app():

    env_path = Path('.') / '.env'
    load_dotenv(dotenv_path=env_path)

    if os.getenv('FLASK_ENV') is None:
        print("'FLASK_ENV' is not set")
    else:
        print("'FLASK_ENV' is set to", os.getenv('FLASK_ENV'))

    app = Flask(__name__)

    if os.getenv('FLASK_ENV') == 'development':
        config = DevelopmentConfig
    elif os.getenv('FLASK_ENV') == 'production':
        config = ProductionConfig
    else:
        print(f"Unknown environment {os.getenv('FLASK_ENV')}")  # Add an else clause to handle unknown environments
        config = Config  # Fall back to the base Config if the environment is unknown

    app.config.from_object(config)

    # Initialize Rollbar
    config.init_app(app)

    print("SQLALCHEMY_DATABASE_URI:", app.config.get('SQLALCHEMY_DATABASE_URI'))

    db.init_app(app)

    from .views import bp
    app.register_blueprint(bp)

    return app