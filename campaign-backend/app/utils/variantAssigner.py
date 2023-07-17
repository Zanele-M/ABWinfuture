from sqlalchemy import func
from models import Aggregates  # Import from your actual project
from scipy.stats import beta
import random
import logging
from rollbar import rollbar  # Import Rollbar from your actual project

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
async def assign_variant_based_on_thompson_sampling(session, campaign, control, variants):
    try:
        # Query the database directly here using SQLAlchemy ORM
        total_clicks_control = (
            session.query(func.sum(Aggregates.total_clicks))
            .filter(Aggregates.assigned_id == control.id)
            .scalar()
        ) or 0
        total_views_control = (
            session.query(func.sum(Aggregates.total_views))
            .filter(Aggregates.assigned_id == control.id)
            .scalar()
        ) or 0

        variant_aggregates = [
            {
                "totalClicks": (
                    session.query(func.sum(Aggregates.total_clicks))
                    .filter(Aggregates.assigned_id == variant.id)
                    .scalar()
                ) or 0,
                "totalViews": (
                    session.query(func.sum(Aggregates.total_views))
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

async def assign_variant_to_user(campaign, control, variants, db):
    confidence_interval_upper = await db.get_confidence_interval_upper(campaign.id)

    if confidence_interval_upper is None or confidence_interval_upper <= 60:
        logger.info("Confidence interval is null or less than or equal to 60, assigning a random variant")
        return assign_random_variant(campaign, control, variants)

    if confidence_interval_upper > 60:
        logger.info("Confidence interval is above 60%, assigning based on Thompson Sampling")
        return await assign_variant_based_on_thompson_sampling(campaign, control, variants, db)

    logger.info("No specific condition was met, assigning a random variant")
    return assign_random_variant(campaign, control, variants)
