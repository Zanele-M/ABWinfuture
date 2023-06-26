

// Function to parse a campaign cookie
function parseCampaignCookie(cookieString: string) {
  // Split the cookie string into the name and value
  const [key, stringValue] = cookieString.split('=');
  // Check if the key starts with 'campaign_'
  if (key.startsWith('campaign_')) {
    // Keep the string value as is, don't parse to JSON
    const value = stringValue;

    // Get the campaign ID from the key
    const campaignId = key.slice('campaign_'.length);
    return { [campaignId]: value };
  }
  return null;
}

// Function to get all campaign cookies from the request
export function getCampaignCookies(req: {cookies: string}): { [campaignId: string]: string } {
  console.log('Getting campaign cookies from request:', req);

  // Split the cookies string into individual cookies
  const cookies = req.cookies.split('; ');

  const campaignCookies = cookies.reduce((acc, cookieString) => {
    const cookie = parseCampaignCookie(cookieString);
    return cookie ? { ...acc, ...cookie } : acc;
  }, {});

  console.log('Campaign cookies:', campaignCookies);
  return campaignCookies;
}

// Function to remove the campaign cookie from the response
export function removeCampaignCookie(campaignId: string, campaignCookies: { [campaignId: string]: string }): { [campaignId: string]: string } {
  delete campaignCookies[campaignId];
  return campaignCookies;
}