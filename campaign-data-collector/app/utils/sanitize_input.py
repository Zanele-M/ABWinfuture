import logging
import rollbar
logger = logging.getLogger(__name__)


def sanitize_input(data):
    try:
        # Ensure all required fields are present
        required_fields = ["assigned_id", "interaction_type", "is_control"]
        if not all(field in data for field in required_fields):
            return None, "Missing one or more required fields"

        # Check if assigned_id field exists and is not None
        if "assigned_id" not in data or data["assigned_id"] is None:
            return None, "Field 'assigned_id' is missing or None"

        # Ensure fields are of correct type
        if not isinstance(data["assigned_id"], int):
            return None, "Invalid type for field 'assigned_id'"
        if not isinstance(data["interaction_type"], str) or data["interaction_type"] not in ["views", "clicks"]:
            return None, "Invalid type or value for field 'interaction_type'"
        if not isinstance(data["is_control"], bool):
            return None, "Invalid type for field 'is_control'"

        sanitized_data = data
        return sanitized_data, None
    except Exception as e:
        extra_data = {"data": data}
        rollbar.report_exc_info(extra_data=extra_data)
        logger.error(f"Input sanitization error: {e}")
        return None, str(e)