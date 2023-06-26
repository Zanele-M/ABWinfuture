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
exports.pauseCampaignController = exports.validateCampaignPause = void 0;
const express_validator_1 = require("express-validator");
const database_1 = require("../database/database");
const index_1 = require("../index"); // adjust the path according to your project structure
/**
 * Middleware for validating and sanitizing the request payload for campaign pausing.
 *
 * @returns {Array} An array of express validator middlewares
 */
const validateCampaignPause = () => [
    (0, express_validator_1.param)('campaign_id').isInt().withMessage('Campaign ID must be an integer'),
];
exports.validateCampaignPause = validateCampaignPause;
/**
 * The controller for pausing a campaign. Expects a request with campaign_id as route param.
 *
 * @param {Request} req The request object from Express.js
 * @param {Response} res The response object from Express.js
 */
const pauseCampaignController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        index_1.rollbar.error('Error pausing campaign:', errors);
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { campaign_id: campaignId } = req.params;
        // Create an instance of the Database class
        const database = new database_1.Database();
        // Call the pauseCampaign method toa pause the campaign
        yield database.resumePauseCampaign(campaignId, "paused");
        // Close the database connection
        database.destructor();
        index_1.rollbar.info('Campaign paused successfully');
        res.status(200).json({ message: 'Campaign paused successfully' });
    }
    catch (error) {
        const err = error;
        console.error('Error pausing campaign:', err);
        index_1.rollbar.error('Error pausing campaign:', err);
        res.status(500).json({ error: 'An error occurred while pausing the campaign' });
    }
});
exports.pauseCampaignController = pauseCampaignController;
