import { Request, Response } from 'express';
import { body, validationResult, param } from 'express-validator';
import { Database } from '../database/database';
import { rollbar } from '../index'; // adjust the path according to your project structure

/**
 * Middleware for validating and sanitizing the request payload for campaign pausing.
 * 
 * @returns {Array} An array of express validator middlewares
 */
export const validateCampaignPause = () => [
  param('campaign_id').isInt().withMessage('Campaign ID must be an integer'),
];

/**
 * The controller for pausing a campaign. Expects a request with campaign_id as route param.
 * 
 * @param {Request} req The request object from Express.js
 * @param {Response} res The response object from Express.js
 */
export const pauseCampaignController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    rollbar.error('Error pausing campaign:', errors);
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { campaign_id: campaignId } = req.params;

    // Create an instance of the Database class
    const database = new Database();

// Call the pauseCampaign method toa pause the campaign
    await database.resumePauseCampaign(campaignId as unknown as number, "paused");
    
    // Close the database connection
    database.destructor();

    rollbar.info('Campaign paused successfully');
    res.status(200).json({ message: 'Campaign paused successfully' });
  } catch (error) {
    const err = error as Error;

    console.error('Error pausing campaign:', err);
    rollbar.error('Error pausing campaign:', err);
    res.status(500).json({ error: 'An error occurred while pausing the campaign' });
  }
};
