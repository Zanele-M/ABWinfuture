"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pauseCampaignController_1 = require("../controllers/pauseCampaignController");
// Create a new router
const router = express_1.default.Router();
// Define the route for creating a campaign
router.put('/campaigns/:campaign_id/pause', pauseCampaignController_1.pauseCampaignController);
// Export the router
exports.default = router;
