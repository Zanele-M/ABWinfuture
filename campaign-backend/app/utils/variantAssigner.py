from app.models import Aggregates, CampaignResults, Control  # Import the required models from your actual project
from scipy.stats import beta
import random
import logging
import rollbar  # Import Rollbar from your actual project

logger = logging.getLogger(__name__)

# Function to assign a random variant
def assign_random_variant(campaign, control, variants):
    all_variants = [control] + variants
    assigned = random.choice(all_variants)
    logger.info(f"Assigned variant: {assigned.name}")
    return {
        "campaignId": campaign.id,
        "assignedIdentifier": assigned.identifier,
        "controlIdentifier": control.identifier,
        "assignedId": assigned.id,
        "isControl": assigned.id == control.id,
        "type": campaign.type,
    }

# Main function
def assign_variant_based_on_thompson_sampling(campaign, control, variants):
    try:
        # Query the database directly here using SQLAlchemy ORM
        total_clicks_control = (
            Aggregates.query.with_entities(func.sum(Aggregates.total_clicks))
            .filter(Aggregates.assigned_id == control.id)
            .scalar()
        ) or 0
        total_views_control = (
            Aggregates.query.with_entities(func.sum(Aggregates.total_views))
            .filter(Aggregates.assigned_id == control.id)
            .scalar()
        ) or 0

        variant_aggregates = [
            {
                "totalClicks": (
                    Aggregates.query.with_entities(func.sum(Aggregates.total_clicks))
                    .filter(Aggregates.assigned_id == variant.id)
                    .scalar()
                ) or 0,
                "totalViews": (
                    Aggregates.query.with_entities(func.sum(Aggregates.total_views))
                    .filter(Aggregates.assigned_id == variant.id)
                    .scalar()
                ) or 0,
            }
            for variant in variants
        ]

        all_clicks_and_views = [
            {"totalClicks": total_clicks_control, "totalViews": total_views_control},
        ] + variant_aggregates

        sampled_ctrs = [
            beta.rvs(total["totalClicks"] + 1, total["totalViews"] - total["totalClicks"] + 1) for total in all_clicks_and_views
        ]

        max_sampled_ctr = max(sampled_ctrs)
        assigned_index = sampled_ctrs.index(max_sampled_ctr)
        assigned = control if assigned_index == 0 else variants[assigned_index - 1]

        logger.info(f"Assigned variant/control: {assigned.name} with sampled CTR: {max_sampled_ctr}")

        assigned_identifier = assigned.identifier
        control_identifier = control.identifier

        if campaign.type == "custom":
            assigned_identifier = ""
            control_identifier = ""

        return {
            "campaignId": campaign.id,
            "assignedIdentifier": assigned_identifier,
            "controlIdentifier": control_identifier,
            "assignedId": assigned.id,
            "type": campaign.type,
            "isControl": assigned_index == 0,
        }
    except Exception as e:
        logger.error(f"Failed to assign variant based on Thompson Sampling: {str(e)}")
        rollbar.error(f"Failed to assign variant based on Thompson Sampling: {str(e)}")
        raise e

def assign_variant_to_user(campaign, control, variants):
    campaign_results = CampaignResults.query.filter_by(campaign_id=campaign.id).first()

    if campaign_results is None or campaign_results.confidence_interval_upper is None:
        logger.info("No campaign results or confidence interval available, assigning a random variant")
        return assign_random_variant(campaign, control, variants)

    confidence_interval_upper = campaign_results.confidence_interval_upper

    if confidence_interval_upper <= 60:
        logger.info("Confidence interval is less than or equal to 60, assigning a random variant")
        return assign_random_variant(campaign, control, variants)

    if confidence_interval_upper > 60:
        logger.info("Confidence interval is above 60%, assigning based on Thompson Sampling")
        return assign_variant_based_on_thompson_sampling(campaign, control, variants)

    logger.info("No specific condition was met, assigning a random variant")
    return assign_random_variant(campaign, control, variants)
