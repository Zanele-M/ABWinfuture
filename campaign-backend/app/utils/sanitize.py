import logging
logger = logging.getLogger(__name__)

import logging
import rollbar

logger = logging.getLogger(__name__)

def parse_campaign_cookie(cookie_string: str) -> dict:
    # Split the cookie string into the name and value
    key, string_value = cookie_string.split('=')
    # Check if the key starts with 'campaign_'
    if key.startswith('campaign_'):
        # Validate the value
        if is_valid_campaign_cookie_value(string_value):
            # Sanitize the value by removing leading/trailing whitespaces
            value = string_value.strip()

            # Get the campaign ID from the key
            campaign_id = key[len('campaign_'):]
            return {campaign_id: value}
    return {}


def is_valid_campaign_cookie_value(value: str) -> bool:
    # Perform your validation checks on the cookie value
    # Return True if the value is valid, otherwise False

    # Example validation: Check if the value has a minimum length of 5 characters
    return len(value) >= 5


def get_campaign_cookies(req_cookies: str) -> dict:
    print('Getting campaign cookies from request:', req_cookies)

    # Check if the request parameter is an empty string
    if req_cookies == "":
        print('No campaign cookies found.')
        return {}

    # Split the cookies string into individual cookies
    cookies = req_cookies.split(';')

    campaign_cookies = {}
    for cookie_string in cookies:
        cookie = parse_campaign_cookie(cookie_string.strip())
        if cookie:
            campaign_cookies.update(cookie)

    print('Campaign cookies:', campaign_cookies)
    return campaign_cookies


def remove_campaign_cookie(campaign_id: str, campaign_cookies: dict) -> dict:
    if campaign_id in campaign_cookies:
        del campaign_cookies[campaign_id]
    return campaign_cookies



