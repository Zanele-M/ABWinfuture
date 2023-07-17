def process_cookies(cookies):
    """ Validate and sanitize the incoming cookies. """
    try:
        # Validate the cookies
        if not isinstance(cookies, dict):
            raise ValueError("Invalid cookies: should be a dictionary")
        if not all(isinstance(key, str) and isinstance(value, str) for key, value in cookies.items()):
            raise ValueError("Invalid cookies: all keys and values should be strings")

        # Sanitize the cookies
        return {key: unescape(value) for key, value in cookies.items()}
    except Exception as e:
        logger.error(f"Error processing cookies: {e}")
        rollbar.report_exc_info()
        return {}

Please replace 'your-rollbar-access-token' and 'your-environment' with your actual Rollbar access token and environment.
