from flask import Blueprint
from flask_socketio import emit
from app import socketio

ws = Blueprint('ws', __name__)

@socketio.on('connect')
def handle_connect():
    print('Client connected')
