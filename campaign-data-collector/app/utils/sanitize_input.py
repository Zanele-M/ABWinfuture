import logging
import rollbar
logger = logging.getLogger(__name__)


def sanitize_input(data):
    try:
        # Ensure all required fields are present
        required_fields = ["assignedId", "interactionType", "isControl"]
        if not all(field in data for field in required_fields):
            return None, "Missing one or more required fields"

        # Check if assignedId field exists and is not None
        if "assignedId" not in data or data["assignedId"] is None:
            return None, "Field 'assignedId' is missing or None"

        # Ensure fields are of correct type
        if not isinstance(data["assignedId"], int):
            return None, "Invalid type for field 'assignedId'"
        if not isinstance(data["interactionType"], str) or data["interactionType"] not in ["views", "clicks"]:
            return None, "Invalid type or value for field 'interactionType'"
        if not isinstance(data["isControl"], bool):
            return None, "Invalid type for field 'isControl'"

        sanitized_data = {'assigne_id' : data['assignedId'],
                          'is_control' : data['isControl'],
                          'interaction_type' : data['interactionType']}
        return sanitized_data, None
    except Exception as e:
        extra_data = {"data": data}
        rollbar.report_exc_info(extra_data=extra_data)
        logger.error(f"Input sanitization error: {e}")
        return None, str(e)