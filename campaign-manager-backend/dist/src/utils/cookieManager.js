"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCampaignCookie = exports.getCampaignCookies = void 0;
// Function to parse a campaign cookie
function parseCampaignCookie(cookieString) {
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
function getCampaignCookies(req) {
    console.log('Getting campaign cookies from request:', req);
    // Split the cookies string into individual cookies
    const cookies = req.cookies.split('; ');
    const campaignCookies = cookies.reduce((acc, cookieString) => {
        const cookie = parseCampaignCookie(cookieString);
        return cookie ? Object.assign(Object.assign({}, acc), cookie) : acc;
    }, {});
    console.log('Campaign cookies:', campaignCookies);
    return campaignCookies;
}
exports.getCampaignCookies = getCampaignCookies;
// Function to remove the campaign cookie from the response
function removeCampaignCookie(campaignId, campaignCookies) {
    delete campaignCookies[campaignId];
    return campaignCookies;
}
exports.removeCampaignCookie = removeCampaignCookie;
