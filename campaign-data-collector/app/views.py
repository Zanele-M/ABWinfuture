from app.utils.interaction_data import add_to_cache_database
from app.utils.sanitize_input import sanitize_input
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import logging

from app.utils.aggregate_data import update_aggregates
import rollbar

bp = Blueprint('views', __name__)

logger = logging.getLogger(__name__)

@bp.route('/user_interactions', methods=['POST'])
@cross_origin()
def create_user_interaction():
    """
    Endpoint to create a new user interaction.
    It first sanitizes the input data, then adds the user interaction instance to the Redis cache.
    """
    try:
        data = request.json

        # Sanitize input data
        sanitized_data, error = sanitize_input(data)
        if error:
            extra_data = {'request': request.json}
            rollbar.report_exc_info(extra_data=extra_data)
            logger.error(f"Input sanitization error: {error}")
            return jsonify({'error': error}), 400

        # Add UserInteraction instance to the Redis cache
        print("Adding to cache database")
        add_to_cache_database(sanitized_data, cache_threshold=20)

        return jsonify({'message': 'User interaction added to cache successfully'}, sanitized_data), 200

    except Exception as e:
        extra_data = {'request': request.json}
        rollbar.report_exc_info(extra_data=extra_data)
        logger.error(f"Error occurred during user interaction creation: {e}")
        return jsonify({'error': 'Error occurred during user interaction creation'}), 500
    
@bp.route('/aggregate_interactions', methods=['GET'])
def aggregate_interactions():
    try:
        update_aggregates()
        return jsonify({'message': 'Successfully aggregated interactions'}), 200

    except Exception as e:
        extra_data = {'request': request.json}
        rollbar.report_exc_info(extra_data=extra_data)
        logger.error(f"Error occurred during interaction aggregation: {e}")
        return jsonify({'error': 'Error occurred during interaction aggregation'}), 500
