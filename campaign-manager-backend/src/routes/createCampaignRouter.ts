import express from 'express';
import { createCampaignController, validateCampaignCreation } from '../controllers/createCampaignController';

// Create a new router
const router = express.Router();

// Define the route for creating a campaign
console.log('createCampaignRouter.ts: Defining the route for creating a campaign');
router.post('/v1/create_campaign', createCampaignController);

// Export the router
export default router;