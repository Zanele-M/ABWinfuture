import json
import logging
from flask import jsonify
from app import redis_client, db
from app.models import Interaction
import random

logger = logging.getLogger(__name__)

def parse_interaction(interaction):
    try:
        # Convert string to dict using json.loads instead of eval
        return json.loads(interaction)
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing interaction: {e}")
        return None

def add_to_cache_database(data, cache_threshold):
    cache_key = 'user_interactions'

    # Check if cache key exists
    if not redis_client.exists(cache_key):
        # Convert dict to JSON string and push to Redis
        redis_client.lpush(cache_key, json.dumps(data))
    else:
        interactions_count = redis_client.llen(cache_key)

        # Check if cache threshold is reached
        if interactions_count >= cache_threshold:
            # Retrieve all interactions from cache
            interactions = redis_client.lrange(cache_key, 0, -1)

            # Process and add interactions to the database
            interaction_instances = []
            for interaction in interactions:
                # Decode bytes to string and convert from JSON to dictionary
                interaction = interaction.decode('utf-8')
                interaction_data = json.loads(interaction)

                logger.info(f"Processing interaction: {interaction_data}")

                # Create Interaction instance
                interaction_instance = Interaction(
                    id=random.randint(1, 1000000000),
                    assigned_id=interaction_data.get('assigned_id'),
                    interaction_type=interaction_data.get('interaction_type'),
                    is_control=interaction_data.get('is_control')
                )
                interaction_instances.append(interaction_instance)

            # Bulk insert to the database
            try:
                db.session.bulk_save_objects(interaction_instances)
                db.session.commit()
                logger.info(f"Successfully inserted {len(interaction_instances)} interactions to the database")
            except Exception as e:
                logger.error(f"Error occurred during bulk insert: {e}")
                db.session.rollback()
                raise e

            # Clear the cache
            redis_client.delete(cache_key)
        else:
            # Convert dict to JSON string and push to Redis
            redis_client.lpush(cache_key, json.dumps(data))
