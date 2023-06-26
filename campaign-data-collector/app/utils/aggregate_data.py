from app.models import Aggregates, Interaction, Variants, Control, Campaign
from sqlalchemy import func
from datetime import datetime
import logging
from app import db
import pytz
from sqlalchemy.dialects.postgresql import ENUM
import rollbar


# Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO)


# Define ENUM type
campaign_status = ENUM('running', 'paused', 'completed', name='campaign_status', create_type=False)
interaction_type = ENUM('clicks', 'views', name='interaction_type', create_type=False)
campaign_type = ENUM('headline', 'custom', 'image', name='campaign_type', create_type=False)


def get_last_update_time(id):
    aggregate = Aggregates.query.filter_by(assigned_id=id).order_by(Aggregates.last_updated.desc()).first()
    if aggregate is None:
        return datetime.min.replace(tzinfo=pytz.UTC)  # Return the minimum datetime if no aggregate exists
    return aggregate.last_updated


def create_aggregate(id, is_control):
    last_updated = get_last_update_time(id)

    # Create the aggregate
    aggregate = Aggregates(
        assigned_id=id,
        last_updated=datetime.utcnow(),
        is_control=is_control
    )

    # Log the last_updated time
    logging.info(f'Last updated time for id {id}: {last_updated}')

    # Count the number of clicks and views
    aggregate.total_clicks = db.session.query(func.count(Interaction.id)).filter(
        Interaction.assigned_id == id,
        Interaction.interaction_type == 'clicks',
        Interaction.interaction_time > last_updated
    ).scalar()
    aggregate.total_views = db.session.query(func.count(Interaction.id)).filter(
        Interaction.assigned_id == id,
        Interaction.interaction_type == 'views',
        Interaction.interaction_time > last_updated
    ).scalar()

    # Log the clicks and views counts
    logging.info(f'Total clicks for id {id}: {aggregate.total_clicks}')
    logging.info(f'Total views for id {id}: {aggregate.total_views}')

    aggregate.ctr = float(aggregate.total_clicks) / aggregate.total_views if aggregate.total_views != 0 else 0

    # Log the aggregate
    logging.info(f'Aggregate before commit: {aggregate.__dict__}')

    if aggregate.ctr != 0:
        db.session.add(aggregate)

    db.session.commit()


def update_aggregates():
    logging.info('Starting update...')
    try:
        # Get all running campaigns
        running_campaigns = Campaign.query.filter_by(status='running')

        # For each running campaign
        for campaign in running_campaigns:
            # Get all variants and controls associated with the campaign
            variants = Variants.query.filter_by(campaign_id=campaign.id).all()
            control = Control.query.filter_by(campaign_id=campaign.id).first()

            # Create and update aggregates for each variant
            for variant in variants:
                create_aggregate(variant.id, False)

            # Create and update aggregates for control
            if control is not None:
                create_aggregate(control.id, True)

        db.session.commit()
        extra_data = {'campaign_id': campaign.id}
        rollbar.report_message('Update completed successfully.', extra_data=extra_data)
        logging.info('Update completed successfully.')
    except Exception as e:
        extra_data = {'campaign_id': campaign.id}
        rollbar.report_exc_info(extra_data=extra_data)
        logging.error(f'Error updating aggregates: {e}')
        db.session.rollback()
        raise e
