"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCampaignRouter = void 0;
const express_1 = __importDefault(require("express"));
const dommanipulator_1 = require("../utils/dommanipulator");
const databaseUtils_1 = require("../utils/databaseUtils");
exports.createCampaignRouter = express_1.default.Router();
exports.createCampaignRouter.post('/v1/create_campaign', (req, res) => {
    // Get the campaign data from the request body
    const campaignData = req.body;
    // Sanity check: Ensure that the request body contains the required data
    if (!campaignData.campaignName || !campaignData.controlName || !campaignData.controlXPath || !campaignData.controlType) {
        console.error('Error creating campaign: Missing required data');
        return res.status(400).json({ error: 'Missing required data' });
    }
    // Sanity check: Ensure that the request body contains at least one variant
    if (!campaignData.variants || campaignData.variants.length === 0) {
        console.error('Error creating campaign: No variants provided');
        return res.status(400).json({ error: 'No variants provided' });
    }
    // Sanity check: Ensure that the request body contains a variant with the name 'control'
    const controlVariant = campaignData.variants.find(variant => variant.name === 'control');
    if (!controlVariant) {
        console.error('Error creating campaign: No control variant provided');
        return res.status(400).json({ error: 'No control variant provided' });
    }
    // Sanity check: Ensure that the request body contains a variant with the XPath of the control element
    const controlVariantXPath = controlVariant.xPath;
    if (!controlVariantXPath) {
        console.error('Error creating campaign: No control variant XPath provided');
        return res.status(400).json({ error: 'No control variant XPath provided' });
    }
    try {
        // Verify the existence of the control element in the DOM
        const controlElement = (0, dommanipulator_1.getElementByXPath)(campaignData.controlXPath);
        if (!controlElement) {
            console.error('Error creating campaign: Control element not found');
            return res.status(400).json({ error: 'Control element not found' });
        }
        // Create the campaign and add it to the database
        const campaign = {
            name: campaignData.campaignName,
            control_name: campaignData.controlName,
            control_identifier: campaignData.controlXPath,
            control_type: campaignData.controlType,
            status: 'active'
        };
        (0, databaseUtils_1.addCampaignToDatabase)(campaign);
        // Logging: Output success message to the console
        console.log('Campaign created successfully!');
        // Send a response
        res.status(200).json({ message: 'Campaign created successfully' });
    }
    catch (error) {
        // Exception handling: Handle any errors that occur during campaign creation
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'An error occurred while creating the campaign' });
    }
});
