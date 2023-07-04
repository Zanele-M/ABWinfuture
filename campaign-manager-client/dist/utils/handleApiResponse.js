"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleApiResponse = void 0;
const contentReplacements_1 = require("./contentReplacements");
/**
 * Process completed campaigns and delete from originalContent
 * @param {Map<number, OriginalContentValue>} originalContent - Map of original content
 * @param {string[]} newCampaigns - Array of new campaign IDs
 */
function processCompletedCampaigns(originalContent, newCampaigns) {
    console.info(`Processing completed campaigns`);
    originalContent.forEach((value, campaignId) => {
        if (!newCampaigns.includes(campaignId)) {
            value.controlPaths.forEach(path => {
                const element = document.querySelector(path);
                if (element) {
                    element.style.display = '';
                }
            });
            document.cookie = `campaign_${campaignId}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            localStorage.removeItem(`click-campaignId-${campaignId}-assignedId-${value.assignedId}`);
            localStorage.removeItem(`impression-campaignId-${campaignId}-assignedId-${value.assignedId}`);
            originalContent.delete(campaignId);
        }
    });
}
/**
 * Process new campaigns and add to originalContent
 * @param {Map<number, OriginalContentValue>} originalContent - Map of original content
 * @param {CookieData} cookieValue - Cookie data
 */
function processNewCampaigns(originalContent, cookieValue) {
    console.info(`Processing new campaigns: ${cookieValue}`);
    const { assignedIdentifier, controlIdentifier, isControl, assignedId, campaignId, type } = cookieValue;
    const controlPaths = (0, contentReplacements_1.findOccurrences)('body', controlIdentifier);
    if (!controlPaths || controlPaths.length === 0) {
        return;
    }
    if (!originalContent.has(campaignId)) {
        const original = {
            content: '', assignedId, controlIdentifier, controlPaths: [],
            campaignId: 0,
            isControl: false
        };
        controlPaths.forEach(path => {
            const element = document.querySelector(path);
            if (element) {
                let content;
                if (element instanceof HTMLImageElement) {
                    content = element.src;
                }
                else {
                    content = element.innerHTML;
                }
                original.content = content;
                original.controlPaths.push(path);
                element.style.display = isControl ? '' : 'none';
            }
        });
        originalContent.set(campaignId, original);
    }
    if (type === 'headline') {
        (0, contentReplacements_1.replaceHeadlineContent)(campaignId, controlIdentifier, assignedIdentifier, assignedId, false, controlPaths);
    }
    else if (type === 'image') {
        (0, contentReplacements_1.replaceTeaserImage)(campaignId, controlIdentifier, assignedIdentifier, assignedId, false, controlPaths);
    }
    else if (type === 'custom') {
        // replaceCustomElementContent(controlIdentifier, assignedIdentifier);
    }
}
/**
 * Handle API response
 * @param {ApiResponseData} data - Response data
 * @param {Map<number, OriginalContentValue>} originalContent - Map of original content
 */
function handleApiResponse(data, originalContent) {
    if (!data) {
        console.error("Data is undefined");
        return;
    }
    if (!data.campaignCookies) {
        console.error("campaignCookies is undefined");
        return;
    }
    console.log("Data received: ", data);
    const newCampaigns = Object.keys(data.campaignCookies).map((key) => JSON.parse(data.campaignCookies[key]).campaignId);
    // Process completed campaigns
    const originalContentMap = originalContent || new Map();
    processCompletedCampaigns(originalContentMap, newCampaigns);
    // Process new campaigns
    for (const [cookieName, cookieString] of Object.entries(data.campaignCookies)) {
        const cookieValue = JSON.parse(cookieString);
        const originalContentMap = originalContent || new Map();
        processNewCampaigns(originalContentMap, cookieValue);
        // Add to cookie if not custom type
        if (cookieValue.type !== 'custom') {
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1); // cookie expires in 1 year
            document.cookie = `campaign_${cookieName}=${cookieString}; SameSite=None; expires=${expires.toUTCString()}; path=/`;
        }
    }
}
exports.handleApiResponse = handleApiResponse;
//# sourceMappingURL=handleApiResponse.js.map