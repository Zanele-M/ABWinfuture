from app.models import Aggregates
from app import db
import numpy as np
from scipy import stats

def perform_statistical_analysis(analysis_data):
    """
    This function performs a one-way ANOVA test on the 'ctr' values from the analysis data.
    It also calculates the mean, standard error, and 95% confidence interval for all 'ctr' values.

    Parameters:
    analysis_data (list): A list of dictionaries where each dictionary represents a group. 
                          Each dictionary contains 'ctr' which is a list of numbers.

    Returns:
    tuple: p-value and 95% confidence interval.
    """
    ctrs = [d['ctr'] for d in analysis_data if d['ctr'] is not None]
    if ctrs:
        f_value, p_value = stats.f_oneway(*ctrs)
    else:
        f_value, p_value = None, None

    all_ctrs = [ctr for group in ctrs for ctr in group if ctr is not None]
    mean_ctr = np.mean(all_ctrs) if all_ctrs else None
    std_err = stats.sem(all_ctrs) if len(all_ctrs) > 1 else None
    if std_err is not None and not np.isnan(std_err):
        confidence_interval = stats.t.interval(0.95, len(all_ctrs)-1, loc=mean_ctr, scale=std_err)
    else:
        confidence_interval = None

    return p_value, confidence_interval


def serialize_entity(entity):
    """
    This function calculates the total views and total clicks from the aggregates and calculates the CTR.
    
    Parameters:
    entity (object): An object that represents an entity for which we need to calculate total views, 
                     total clicks and CTR.

    Returns:
    dict: Dictionary with id, name, total views, total clicks and CTR for the entity.
    """
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


def get_total_clicks_and_views(entities):
    """
    This function aggregates the total views and clicks for a list of entities.
    
    Parameters:
    entities (list): List of entities for which we need to calculate total views and total clicks.

    Returns:
    tuple: Total clicks and total views.
    """
    total_clicks = 0
    total_views = 0

    for entity in entities:
        aggregates = Aggregates.query.filter_by(assigned_id=entity.id).all()
        total_clicks += sum([agg.total_clicks for agg in aggregates])
        total_views += sum([agg.total_views for agg in aggregates])

    return total_clicks, total_views


def get_winner(entities, p_value, confidence_interval):
    """
    This function determines the winner based on the p_value and confidence_interval.
    
    Parameters:
    entities (list): List of entities from which we need to determine the winner.
    p_value (float): The p-value of the statistical test.
    confidence_interval (tuple): The confidence interval of the test.

    Returns:
    str: The name of the winner.
    """
    # Assuming the winner is the one with the highest CTR and falls within the confidence interval
    if p_value < 0.05:
        entities_within_confidence_interval = [entity for entity in entities if entity['ctr'] >= confidence_interval[0] and entity['ctr'] <= confidence_interval[1]]
        winner = max(entities_within_confidence_interval, key=lambda x: x['ctr']) if entities_within_confidence_interval else None
        return winner['name'] if winner else None
    else:
        return None


def format_confidence_interval(lower, upper):
    """
    This function formats the confidence interval to be more readable.
    
    Parameters:
    lower (float): The lower bound of the confidence interval.
    upper (float): The upper bound of the confidence interval.

    Returns:
    str: The formatted confidence interval.
    """
    return f'[{lower:.2f}, {upper:.2f}]'
