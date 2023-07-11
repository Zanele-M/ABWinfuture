import express from 'express';
import { pauseCampaignController, validateCampaignPause } from '../controllers/pauseCampaignController';

// Create a new router
const router = express.Router();

// Define the route for creating a campaign
router.put('/pause/:campaign_id', pauseCampaignController);

// Export the router
export default router;