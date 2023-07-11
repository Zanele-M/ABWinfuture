"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const runCampaignController_1 = require("../controllers/runCampaignController");
// Create a new router
const campaignRouter = express_1.default.Router();
// Define the route for creating a campaign
campaignRouter.post('/run_campaigns', runCampaignController_1.validateCookies, runCampaignController_1.runCampaignController);
// Export the router
exports.default = campaignRouter;
