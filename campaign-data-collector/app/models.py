from datetime import datetime
from sqlalchemy.dialects.postgresql import ENUM
from app import db

# Define ENUM type
campaign_status = ENUM('running', 'paused', 'completed', name='campaign_status', create_type=False)
interaction_type = ENUM('clicks', 'views', name='interaction_type', create_type=False)
campaign_type = ENUM('headline', 'custom', 'image', name='campaign_type', create_type=False)

class Interaction(db.Model):
    __tablename__ = 'interactions'
    id = db.Column(db.Integer, primary_key=True)
    assigned_id = db.Column(db.Integer, nullable=False) 
    is_control = db.Column(db.Boolean, nullable=False) # either true or false
    interaction_type = db.Column(db.String(10), nullable=False)  # Either 'click' or 'view'
    interaction_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class Variants(db.Model):
    __tablename__ = 'variants'
    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    identifier = db.Column(db.String(255), nullable=False)

class Control(db.Model):
    __tablename__ = 'controls'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    identifier = db.Column(db.String(255), nullable=False)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'), nullable=False)

class Aggregates(db.Model):
    __tablename__ = 'aggregates'
    id = db.Column(db.Integer, primary_key=True)
    assigned_id = db.Column(db.Integer)
    last_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    total_clicks = db.Column(db.Integer, default=0)
    total_views = db.Column(db.Integer, default=0)
    ctr = db.Column(db.Float, default=0)
    is_control = db.Column(db.Boolean, nullable=False) # either true or false'

class Campaign(db.Model):
    __tablename__ = 'campaigns'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    status = db.Column(campaign_status, nullable=False)
    type = db.Column(campaign_type, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)