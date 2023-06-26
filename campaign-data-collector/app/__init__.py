import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from pathlib import Path
import redis
from .config import Config, DevelopmentConfig, ProductionConfig


db = SQLAlchemy()
redis_client = redis.Redis()

def create_app():
    if os.getenv('FLASK_ENV') is None:
        print("'FLASK_ENV' is not set")
    else:
        print("'FLASK_ENV' is set to", os.getenv('FLASK_ENV'))
    env_path = Path('.') / '.env'
    load_dotenv(dotenv_path=env_path)

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

    # Initialize Redis
    redis_host = app.config['REDIS_HOST']
    redis_port = app.config['REDIS_PORT']
    redis_db = app.config['REDIS_DB']
    redis_client = redis.Redis(host=redis_host, port=redis_port, db=redis_db)

    from .views import bp
    app.register_blueprint(bp)

    return app