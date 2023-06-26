import { Request, Response } from 'express';
import { body, validationResult, param } from 'express-validator';
import { Database } from '../database/database';
import { rollbar } from '../index'; // adjust the path according to your project structure

/**
 * Middleware for validating and sanitizing the request payload for resuming campaign.
 * 
 * @returns {Array} An array of express validator middlewares
 */
export const validateCampaignResume = () => [
  param('campaign_id').isInt().withMessage('Campaign ID must be an integer'),
];

/**
 * The controller for pausing a campaign. Expects a request with campaign_id as route param.
 * 
 * @param {Request} req The request object from Express.js
 * @param {Response} res The response object from Express.js
 */
export const resumeCampaignController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    rollbar.error('Error resuming campaign:', errors);
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { campaign_id: campaignId } = req.params;

    // Create an instance of the Database class
    const database = new Database();

// Call the resumeCampaign method to resume the campaign
    await database.resumePauseCampaign(campaignId as unknown as number, 'running');
    
    // Close the database connection
    database.destructor();

    rollbar.info('Campaign resumed successfully');
    res.status(200).json({ message: 'Campaign resumed successfully' });
  } catch (error) {
    const err = error as Error;

    console.error('Error resuming campaign:', err);
    rollbar.error('Error resuming campaign:', err);
    res.status(500).json({ error: 'An error occurred while resuming the campaign' });
  }
};
