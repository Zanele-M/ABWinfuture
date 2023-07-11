import express from 'express';
import { resumeCampaignController } from '../controllers/resumeCampaignController';

// Create a new router
const router = express.Router();

// Define the route for creating a campaign
router.put('/resume/:campaign_id/', resumeCampaignController);

// Export the router
export default router;