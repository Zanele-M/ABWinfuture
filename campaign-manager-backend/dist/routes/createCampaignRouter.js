"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createCampaignController_1 = require("../controllers/createCampaignController");
// Create a new router
const router = express_1.default.Router();
// Define the route for creating a campaign
console.log('createCampaignRouter.ts: Defining the route for creating a campaign');
router.post('/v1/create_campaign', createCampaignController_1.createCampaignController);
// Export the router
exports.default = router;
