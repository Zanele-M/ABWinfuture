import datetime
import rollbar
import logging

from app.models import Campaign
from app.models import VariantResults, CampaignResults, ControlResults, Control, Variants, Aggregates
from app.utils import perform_statistical_analysis
from flask_cors import cross_origin
from flask import Blueprint, jsonify
from app import db
import pytz


bp = Blueprint('views', __name__)
logger = logging.getLogger(__name__)

@bp.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Headers'] = 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

@bp.route('/v1/get_results', methods=['GET'])
@cross_origin()
def calculate_results():
    try:
        campaigns = Campaign.query.all()
        if not campaigns:
            raise ValueError('No campaign data')
        
        campaign_results = []
        for campaign in campaigns:
            if campaign.status == "complete":
                completed_results = get_completed_campaign_results(campaign)
                campaign_results.extend(completed_results)
            elif campaign.status == "paused":
                paused_results = get_paused_campaign_results(campaign)
                campaign_results.extend(paused_results)
            elif campaign.status == "running":
                running_results = get_running_campaign_results(campaign)
                campaign_results.extend(running_results)
        
        return jsonify(campaign_results), 200
    except Exception as e:
        extra_data = {
            'campaign_results': campaign_results if 'campaign_results' in locals() else None,
            'campaigns': [campaign.id for campaign in campaigns] if 'campaigns' in locals() else None,
        }
        rollbar.report_exc_info(extra_data=extra_data)  # Reports current exception to Rollbar
        logger.error(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred'}), 500


def get_completed_campaign_results(campaign):
    logger.info(f"Retrieving the analysis results for completed campaign: {campaign.id}")

    campaign_result = CampaignResults.query.filter_by(campaign_id=campaign.id).first()

    if not campaign_result:
        return None

    winner_results = get_winner_results(campaign_result)


    campaign_results = construct_campaign_results(campaign, campaign_result, winner_results)
    return campaign_results


def get_paused_campaign_results(campaign):
    logger.info(f"Retrieving the analysis results for paused campaign: {campaign.id}")
    variants = Variants.query.filter_by(campaign_id=campaign.id).all()
    control = Control.query.filter_by(campaign_id=campaign.id).first()

    result = {
        "campaign_id": campaign.id,
        "status": "Paused",
        "variants": [serialize_entity(variant) for variant in variants],
        "control": serialize_entity(control),
        "date_created": campaign.created_at,
        "campaign_name": campaign.name,
    }
    return [result]

def serialize_entity(entity):
    total_views = Aggregates.query.with_entities(db.func.sum(Aggregates.total_views)).filter_by(assigned_id=entity.id).scalar() or 0
    total_clicks = Aggregates.query.with_entities(db.func.sum(Aggregates.total_clicks)).filter_by(assigned_id=entity.id).scalar() or 0
    
    # Calculate CTR only if total_views is not zero
    ctr = (total_clicks / total_views * 100) if total_views != 0 else 0

    return {
        "id": entity.id,
        "name": entity.name,
        "total_views": total_views,
        "total_clicks": total_clicks,
        "ctr": ctr,
    }

def get_winner_results(campaign_result):
    if campaign_result.winner_is_control:
        return ControlResults.query.filter_by(control_id=campaign_result.winner_id).first()
    else:
        return VariantResults.query.filter_by(variant_id=campaign_result.winner_id).first()

def construct_campaign_results(campaign, campaign_result, winner_results):
    variants = Variants.query.filter_by(campaign_id=campaign.id).all()
    control = Control.query.filter_by(campaign_id=campaign.id).first()

    serialized_variants = [serialize_entity(variant) for variant in variants]
    serialized_control = serialize_entity(control)

    total_clicks, total_views = get_total_clicks_and_views(variants + [control])

    p_value, confidence_interval = perform_statistical_analysis(variants + [control])

    winner = get_winner(variants + [control], p_value, confidence_interval)

    analysis_time = (datetime.datetime.now(pytz.UTC) - campaign.created_at).total_seconds()

    status = "completed" if winner != "Not determined yet" else "running"

    result = {
        "campaign_id": campaign.id,
        "confidence_interval": format_confidence_interval (confidence_interval[0], confidence_interval[1] ) if confidence_interval else None,
        "winner": winner.name,
        "analysis_time": analysis_time,
        "variants": serialized_variants,
        "control": serialized_control,
        "campaign_name": campaign.name,
        "date_created": campaign.created_at,
        "status": status,
    }

    save_campaign_results(campaign, p_value, winner_results, analysis_time)
    save_variant_results(variants, confidence_interval)
    save_control_results(control, confidence_interval)

    return result

def get_total_clicks_and_views(entities):
    total_clicks = 0
    total_views = 0

    if isinstance(entities, list):
        for entity in entities:
            aggregates = Aggregates.query.filter_by(assigned_id=entity.id).all()
            total_clicks += sum([agg.total_clicks for agg in aggregates])
            total_views += sum([agg.total_views for agg in aggregates])
    else:
        aggregates = Aggregates.query.filter_by(assigned_id=entities.id).all()
        total_clicks += sum([agg.total_clicks for agg in aggregates])
        total_views += sum([agg.total_views for agg in aggregates])

    return total_clicks, total_views


def get_winner(entities, p_value, confidence_interval):
    if p_value <= 0.05 and confidence_interval[0] >= 0.95 and confidence_interval[1] <= 1.05:
        winner = max(entities, key=lambda x: max(filter(None, x['ctr']), default=0) if filter(None, x['ctr']) else 0)['entity'] if entities else "Not determined yet"
    else:
        winner = "Not determined yet"
    return winner

def save_campaign_results(campaign, p_value, winner, analysis_time, confidence_interval):
    try:
        winner_id = winner.id if not isinstance(winner, str) else None
        is_control = isinstance(winner, Control) if not isinstance(winner, str) else False

        analysis_results = CampaignResults.query.filter_by(campaign_id=campaign.id).first()
        if analysis_results is None:
            analysis_results = CampaignResults (
                campaign_id=campaign.id,
                p_value=p_value,
                winner_id=winner_id,
                analysis_time=analysis_time,
                last_update=datetime.datetime.now(),
                is_control=is_control,
                confidence_interval_lower = confidence_interval[0] if confidence_interval else None,
                confidence_interval_upper = confidence_interval[1] if confidence_interval else None
            )
        else:
            analysis_results.p_value = p_value
            analysis_results.winner_id = winner_id
            analysis_results.analysis_time = analysis_time
            analysis_results.last_update = datetime.datetime.now()
            analysis_results.is_control = is_control
            analysis_results.confidence_interval_lower = confidence_interval[0] if confidence_interval else None
            analysis_results.confidence_interval_upper = confidence_interval[1] if confidence_interval else None

        # Update campaign's status to "completed" if there's a winner
        if winner != "Not determined yet":
            campaign.status = "completed"
            db.session.add(campaign)

        db.session.add(analysis_results)
        db.session.commit()
    except Exception as e:
        extra_data = {
            'campaign_id': campaign.id if 'campaign' in locals() else None,
            'p_value': p_value if 'p_value' in locals() else None,
            'winner': winner.id if 'winner' in locals() and not isinstance(winner, str) else None,
            'analysis_time': analysis_time if 'analysis_time' in locals() else None,
            'confidence_interval': confidence_interval if 'confidence_interval' in locals() else None,
        }
        rollbar.report_exc_info(extra_data=extra_data)  # Reports current exception to Rollbar
        logger.error('Error occurred while saving campaign results: %s', str(e))
        raise e  # Re-raise the exception after logging it

def save_variant_results(variants):
    try:
        for variant in variants:
            variant_results = VariantResults.query.filter_by(variant_id=variant.id).first()
            if variant_results is None:
                variant_results = VariantResults(
                    campaign_id=variant.campaign_id,
                    variant_id=variant.id
                )

            db.session.add(variant_results)
        db.session.commit()
    except Exception as e:
        extra_data = {
            'variant_ids': [variant.id for variant in variants] if 'variants' in locals() else None,
        }
        rollbar.report_exc_info(extra_data=extra_data)  # Reports current exception to Rollbar
        logger.error('Error occurred while saving variant results: %s', str(e))
        raise e  # Re-raise the exception after logging it


def save_control_results(control):
    try:
        control_results = ControlResults.query.filter_by(control_id=control.id).first()
        if control_results is None:
            control_results = ControlResults(
                campaign_id=control.campaign_id,
                control_id=control.id,
            )

        db.session.add(control_results)
        db.session.commit()
    except Exception as e:
        extra_data = {
            'control_id': control.id if 'control' in locals() else None,
            'campaign_id': control.campaign_id if 'control' in locals() else None,
        }
        rollbar.report_exc_info(extra_data=extra_data)  # Reports current exception to Rollbar
        logger.error('Error occurred while saving control results: %s', str(e))
        raise e  # Re-raise the exception after logging it

def get_winner_results(campaign_result):
    if campaign_result.winner_is_control:
        return ControlResults.query.filter
    
def get_completed_campaign_results(campaign):
    logger.info(f"Retrieving the analysis results for completed campaign: {campaign.id}")

    campaign_result = CampaignResults.query.filter_by(campaign_id=campaign.id).first()
    winner_results = get_winner_results(campaign_result) if campaign_result else None

    # Collect basic campaign data
    campaign_data = {
        "campaign_id": campaign.id,
        "status": campaign.status,
        "variants": [serialize_entity(variant) for variant in Variants.query.filter_by(campaign_id=campaign.id).all()],
        "control": serialize_entity(Control.query.filter_by(campaign_id=campaign.id).first()),
        "date_created": campaign.created_at,
        "campaign_name": campaign.name,
    }

    # If no winner_results, return the basic campaign data
    if not winner_results:
        return campaign_data

    # If there are winner_results, append the results to the campaign data
    campaign_results = {
        "confidence_interval": format_confidence_interval(winner_results.confidence_interval_lower, winner_results.confidence_interval_upper),
        "winner": winner_results.name,
        "analysis_time": campaign_result.analysis_time
    }
    campaign_data.update(campaign_results)
    return campaign_data


def get_running_campaign_results(campaign):
    try:
        logger.info(f"Retrieving the analysis results for running campaign: {campaign.id}")
        results = []
        variants = Variants.query.filter_by(campaign_id=campaign.id).all()
        control = Control.query.filter_by(campaign_id=campaign.id).first()

        analysis_data = []
        serialized_variants = []

        for entity in variants + [control]:
            aggregates = Aggregates.query.filter_by(assigned_id=entity.id).all()
            ctrs = [agg.ctr for agg in aggregates]

            analysis_data.append({
                "entity": entity,
                "ctr": ctrs,
            })

            total_clicks, total_views = get_total_clicks_and_views(entity)

            if isinstance(entity, Variants):
                serialized_variants.append(serialize_entity(entity))
            else:
                serialized_control = serialize_entity(entity)

        logger.info("Analysis data length: %d", len(analysis_data))

        if len(analysis_data) >= 2:
            p_value, confidence_intervals = perform_statistical_analysis(analysis_data)
            logger.info("p_value: %s", p_value)
            logger.info("confidence_intervals: %s", confidence_intervals)
            winner = get_winner(analysis_data, p_value, confidence_intervals)
            winner_name = winner.name if not isinstance(winner, str) else winner
            status = "completed" if winner != "Not determined yet" else "running"
            confidence_interval = format_confidence_interval(confidence_intervals[0], confidence_intervals[1]) if confidence_intervals is not None else None
            winner_name = "Not determined yet"
            status = "running"
            confidence_interval = "N/A"

        analysis_time = (datetime.datetime.now(pytz.UTC) - campaign.created_at).total_seconds()

        result = {
            "campaign_id": campaign.id,
            "confidence_interval": confidence_interval,
            "winner": winner_name,
            "analysis_time": analysis_time,
            "variants": serialized_variants,
            "control": serialized_control,
            "campaign_name": campaign.name,
            "date_created": campaign.created_at,
            "status": status,
        }

        save_campaign_results(campaign, p_value if 'p_value' in locals() else None, winner if 'winner' in locals() else None, analysis_time, confidence_intervals if 'confidence_intervals' in locals() else None)
        save_variant_results(variants)
        save_control_results(control)

        results.append(result)
    except Exception as e:
        extra_data = {
        'campaign_id': campaign.id if 'campaign' in locals() else None,
        'analysis_data': analysis_data if 'analysis_data' in locals() else None,
        'variants': serialized_variants if 'serialized_variants' in locals() else None,
        'control': serialized_control if 'serialized_control' in locals() else None,
        'winner_name': winner_name if 'winner_name' in locals() else None,
        'status': status if 'status' in locals() else None,
        'analysis_time': analysis_time if 'analysis_time' in locals() else None,
        'confidence_interval': confidence_interval if 'confidence_interval' in locals() else None }
        rollbar.report_exc_info(extra_data=extra_data)
        logger.error('Error occurred while retrieving campaign results: %s', str(e))
    return results


def format_confidence_interval(lower, upper):
    print(lower, upper)
    if lower is None or upper is None:
        return "N/A"
    return "{:.2f}% to {:.2f}%".format(lower * 100, upper * 100)
