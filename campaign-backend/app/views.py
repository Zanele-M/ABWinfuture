from flask import request, jsonify
from app import db
from app.models import Campaign, Control, Variants
import rollbar
from flask import Blueprint, jsonify
import logging
from flask_cors import cross_origin




bp = Blueprint('views', __name__)
logger = logging.getLogger(__name__)

@bp.route('/run_campaigns', methods=['POST'])
@cross_origin()
def run_campaigns():
    cookies = process_cookies(request.json.get('cookies'))
    try:
        active_campaigns = Campaign.query.filter_by(is_active=True).all()
        active_campaign_ids = [campaign.id for campaign in active_campaigns]
        campaign_cookies = {}

        if cookies:
            campaign_cookies = get_campaign_cookies(cookies)

            for campaign_id, cookie in list(campaign_cookies.items()):
                if campaign_id not in active_campaign_ids:
                    del campaign_cookies[campaign_id]

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