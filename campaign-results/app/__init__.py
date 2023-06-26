from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from .config import Config, DevelopmentConfig, ProductionConfig
from pathlib import Path
import os

db = SQLAlchemy()

def create_app():
    if os.getenv('FLASK_ENV') is None:
        print("'FLASK_ENV' is not set")
    else:
        print("'FLASK_ENV' is set to", os.getenv('FLASK_ENV'))

    # Identify the environment and load the appropriate .env file
    if os.getenv('FLASK_ENV') == 'development':
        env_path = Path('.') / '.env'
        config_class = DevelopmentConfig
    elif os.getenv('FLASK_ENV') == 'production':
        env_path = Path('.') / '.env.prod'
        config_class = ProductionConfig
    load_dotenv(dotenv_path=env_path)
    
    app = Flask(__name__)

    # Config class based on the environment
    app.config.from_object(config_class)

    config_class.init_app(app)

    # Moved these lines here.
    db.init_app(app)

    from .views import bp
    app.register_blueprint(bp)

    return app