"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCampaignCookie = void 0;
{
    if (typeof value === 'string' && key.startsWith('campaign_')) {
        const campaignId = key.slice('campaign_'.length);
        campaignCookies[campaignId] = value;
    }
}
return campaignCookies;
// Function to remove the campaign cookie from the response
function removeCampaignCookie(campaignId, campaignCookies) {
    delete campaignCookies[campaignId];
    return campaignCookies;
}
exports.removeCampaignCookie = removeCampaignCookie;
