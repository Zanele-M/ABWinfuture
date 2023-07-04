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
exports.createCampaignController = exports.validateCampaignCreation = void 0;
const express_validator_1 = require("express-validator");
const database_1 = require("../database/database");
const index_1 = require("../../index"); // adjust the path according to your project structure
/**
 * Middleware for validating and sanitizing the request payload for campaign creation.
 *
 * @returns {Array} An array of express validator middlewares
 */
const validateCampaignCreation = () => [
    (0, express_validator_1.body)('campaign_name').trim().escape().notEmpty().withMessage('Campaign name is required'),
    (0, express_validator_1.body)('control_name').trim().escape().notEmpty().withMessage('Control name is required'),
    (0, express_validator_1.body)('control_identifier').trim().escape().notEmpty().withMessage('Control identifier is required'),
    (0, express_validator_1.body)('type').trim().escape().notEmpty().withMessage('Type is required'),
    (0, express_validator_1.body)('variants.*.name').trim().escape().notEmpty().withMessage('Variant name is required'),
    (0, express_validator_1.body)('variants.*.identifier').trim().escape().notEmpty().withMessage('Variant identifier is required'),
];
exports.validateCampaignCreation = validateCampaignCreation;
/**
 * The controller for campaign creation. Expects a request payload with campaign_name,
 * control_name, control_identifier, type, and variants. Variants is an array of
 * objects with name and identifier properties.
 *
 * @param {Request} req The request object from Express.js
 * @param {Response} res The response object from Express.js
 */
const createCampaignController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.error('Error creating campaign:', errors);
        index_1.rollbar.error('Error creating campaign:', errors);
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Get the campaign data from the request body
        console.log(`Creating campaign: ${req.body}`);
        index_1.rollbar.info(`Creating campaign: ${req.body}`);
        const { campaign_name: campaignName, control_name: controlName, control_identifier: controlIdentifier, type, variants } = req.body;
        // Create an instance of the Database class
        const database = new database_1.Database();
        // Call the createCampaign method to insert the campaign into the database
        yield database.createCampaign(campaignName, type, variants, controlName, controlIdentifier);
        // Close the database connection
        database.destructor();
        res.status(201).json({ message: 'Campaign created successfully' });
    }
    catch (error) {
        const err = error;
        index_1.rollbar.error('Error creating campaign:', err);
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'An error occurred while creating the campaign' });
    }
});
exports.createCampaignController = createCampaignController;
