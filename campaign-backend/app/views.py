from flask import Blueprint, jsonify, request
from app import db
from app.models import Campaign, Control, Variants
import rollbar
from flask_cors import cross_origin
from app.utils.sanitize import get_campaign_cookies
import logging
from app.utils.variantAssigner import assign_variant_to_user
bp = Blueprint('views', __name__)
logger = logging.getLogger(__name__)

@bp.route('/run_campaigns', methods=['POST'])
@cross_origin()
def run_campaigns():
    campaign_cookies = get_campaign_cookies(request.json.get('cookies'))
    try:
        logger.info(f"Campaign Cookies: {campaign_cookies}")

        active_campaigns = Campaign.query.filter_by(status='running').all()
        active_campaign_ids = [campaign.id for campaign in active_campaigns]

        if campaign_cookies:
            # Remove cookies for campaigns that are not active
            campaign_cookies = {campaign_id: cookie for campaign_id, cookie in campaign_cookies.items() if campaign_id in active_campaign_ids}

            # Delete cookies for campaigns that are paused or completed
            for campaign_id in campaign_cookies.kefys():
                campaign = Campaign.query.get(campaign_id)
                if campaign and campaign.status in ['paused', 'completed']:
                    del campaign_cookies[campaign_id]

            # Assign new cookies for campaigns that were not in the original cookies
            new_campaigns = [campaign for campaign in active_campaigns if campaign.id not in campaign_cookies]

            for campaign in new_campaigns:
                control = Control.query.filter_by(campaign_id=campaign.id).first()
                variants = Variants.query.filter_by(campaign_id=campaign.id).all()
                campaign_cookie = assign_variant_to_user(campaign, control, variants)
                if campaign_cookie:
                    campaign_cookies[campaign.id] = campaign_cookie

        else:
            for campaign in active_campaigns:
                control = Control.query.filter_by(campaign_id=campaign.id).first()
                variants = Variants.query.filter_by(campaign_id=campaign.id).all()
                campaign_cookie = assign_variant_to_user(campaign, control, variants)
                if campaign_cookie:
                    campaign_cookies[campaign.id] = campaign_cookie

        logger.info(f"Cookie data has been successfully updated for campaigns: {campaign_cookies}")
        rollbar.report_message(f"Cookie data has been successfully updated for campaigns: {campaign_cookies}", 'info')

        return jsonify({'message': 'Cookie data has been successfully updated', 'campaignCookies': campaign_cookies}), 200
    except Exception as e:
        logger.error(f"Error during campaign processing: {e}")
        rollbar.report_exc_info()
        return jsonify({'error': str(e)}), 500
