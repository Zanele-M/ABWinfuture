"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCampaignController = exports.validateCookies = void 0;
const express_validator_1 = require("express-validator");
const variantAssigner_1 = require("../utils/variantAssigner");
const cookieManager_1 = require("../utils/cookieManager");
const database_1 = require("../database/database");
const index_1 = require("../index"); // adjust the path according to your project structure
// Validate and sanitize cookies
exports.validateCookies = [
    (0, express_validator_1.body)('cookies').trim().escape(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            index_1.rollbar.error('Error running campaign:', errors);
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
/**
 * runCampaignController - The controller function for running campaigns.
 * It assigns variants to users based on active campaigns, and returns updated cookies for each campaign.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
const runCampaignController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        index_1.rollbar.log('Running campaign controller with request body:', req.body);
        console.log('Running campaign controller with request body:', req.body);
        const db = new database_1.Database();
        // Get the active campaigns from the database
        const activeCampaigns = yield db.getActiveCampaigns();
        const activeCampaignIds = activeCampaigns.map((campaign) => campaign.id);
        let campaignCookies = {};
        // Sanitize cookies
        if (req.body.cookies !== '') {
            campaignCookies = (0, cookieManager_1.getCampaignCookies)(req.body);
            // Remove campaign cookies that are not present in active campaigns
            for (const campaignId in campaignCookies) {
                if (!activeCampaignIds.includes(parseInt(campaignId, 10))) {
                    console.log(`Removed campaign cookie for ${campaignId}`);
                    delete campaignCookies[campaignId];
                }
            }
            // Get new campaigns (i.e., campaigns not present in the cookies)
            const newCampaigns = activeCampaigns.filter((campaign) => !campaignCookies.hasOwnProperty(campaign.id.toString()));
            // Assign variants and add campaigns to cookies for the new campaigns
            for (const campaign of newCampaigns) {
                console.log('Checking campaign:', campaign);
                const control = yield db.getControlForCampaign(campaign.id);
                const variants = yield db.getVariantsForCampaign(campaign.id);
                const campaignCookie = yield (0, variantAssigner_1.assignVariantToUser)(campaign, control, variants, db);
                if (campaignCookie) {
                    // Convert the CampaignCookie object to a string
                    const campaignCookieString = JSON.stringify(campaignCookie);
                    campaignCookies[`${campaign.id}`] = campaignCookieString;
                }
            }
        }
        else {
            // If campaign cookies are empty, assign variants for all active campaigns
            for (const campaign of activeCampaigns) {
                console.log('Checking campaign:', campaign);
                const control = yield db.getControlForCampaign(campaign.id);
                const variants = yield db.getVariantsForCampaign(campaign.id);
                const campaignCookie = yield (0, variantAssigner_1.assignVariantToUser)(campaign, control, variants, db);
                if (campaignCookie) {
                    // Convert the CampaignCookie object to a string
                    console.log(campaignCookie);
                    const campaignCookieString = JSON.stringify(campaignCookie);
                    campaignCookies[`${campaign.id}`] = campaignCookieString;
                }
            }
        }
        // Send the response with the updated campaign cookies
        console.log('Sending response with campaign cookies:', campaignCookies);
        res.status(200).json({ message: 'Cookies have been successfully updated', campaignCookies: campaignCookies });
    }
    catch (error) {
        const err = error;
        index_1.rollbar.error('Error running campaign:', err);
        console.error('Error reading campaign cookies:', err);
        res.status(500).json({ error: 'An error occurred while reading campaign cookies' });
    }
});
exports.runCampaignController = runCampaignController;
