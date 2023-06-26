from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import ENUM

# Define ENUM type
campaign_status = ENUM('running', 'paused', 'complete', name='campaign_status', create_type=False)
interaction_type = ENUM('clicks', 'views', name='interaction_type', create_type=False)
campaign_type = ENUM('headline', 'custom', 'image', name='campaign_type', create_type=False)

class Campaign(db.Model):
    __tablename__ = 'campaigns'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    status = db.Column(campaign_status, nullable=False)
    type = db.Column(campaign_type, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)

class Control(db.Model):
    __tablename__ = 'controls'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    identifier = db.Column(db.String(255), nullable=False)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'))

class Variants(db.Model):
    __tablename__ = 'variants'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    identifier = db.Column(db.String(255), nullable=False)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'))

class Aggregates(db.Model):
    __tablename__ = 'aggregates'

    id = db.Column(db.Integer, primary_key=True)
    assigned_id = db.Column(db.Integer)
    total_clicks = db.Column(db.Integer, default=0)
    total_views = db.Column(db.Integer, default=0)
    ctr = db.Column(db.Float, default=0)
    last_updated = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)

class CampaignResults(db.Model):
    __tablename__ = 'campaign_results'
    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'))
    winner_id = db.Column(db.Integer)
    analysis_time  = db.Column(db.Integer, nullable=False)
    last_update = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    is_control = db.Column(db.Boolean)
    p_value = db.Column(db.Float)
    confidence_interval_upper = db.Column(db.Float)
    confidence_interval_lower = db.Column(db.Float)  

class ControlResults(db.Model):
    __tablename__ = 'control_results'

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'))
    last_updated = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    control_id = db.Column(db.Integer, db.ForeignKey('controls.id'))

class VariantResults(db.Model):
    __tablename__ = 'variant_results'

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'))
    last_updated = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    variant_id = db.Column(db.Integer, db.ForeignKey('variants.id'))
