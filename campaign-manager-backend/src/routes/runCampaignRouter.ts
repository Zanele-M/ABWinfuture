import express from 'express';
import { runCampaignController, validateCookies } from '../controllers/runCampaignController';



// Create a new router
const campaignRouter = express.Router();

// Define the route for creating a campaign
campaignRouter.post('/run_campaigns', validateCookies,  runCampaignController);

// Export the router
export default campaignRouter;
