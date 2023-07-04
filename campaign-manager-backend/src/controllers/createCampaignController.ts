import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Database } from '../database/database';
import { rollbar } from '../../index'; // adjust the path according to your project structure
/**
 * Middleware for validating and sanitizing the request payload for campaign creation.
 * 
 * @returns {Array} An array of express validator middlewares
 */
export const validateCampaignCreation = () => [
  body('campaign_name').trim().escape().notEmpty().withMessage('Campaign name is required'),
  body('control_name').trim().escape().notEmpty().withMessage('Control name is required'),
  body('control_identifier').trim().escape().notEmpty().withMessage('Control identifier is required'),
  body('type').trim().escape().notEmpty().withMessage('Type is required'),
  body('variants.*.name').trim().escape().notEmpty().withMessage('Variant name is required'),
  body('variants.*.identifier').trim().escape().notEmpty().withMessage('Variant identifier is required'),
];

/**
 * The controller for campaign creation. Expects a request payload with campaign_name, 
 * control_name, control_identifier, type, and variants. Variants is an array of 
 * objects with name and identifier properties.
 * 
 * @param {Request} req The request object from Express.js
 * @param {Response} res The response object from Express.js
 */
export const createCampaignController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Error creating campaign:', errors);
    rollbar.error('Error creating campaign:', errors);
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get the campaign data from the request body
    console.log(`Creating campaign: ${req.body}`)
    rollbar.info(`Creating campaign: ${req.body}`)
    
    const { campaign_name: campaignName, control_name: controlName, control_identifier: controlIdentifier, type, variants } = req.body;

    // Create an instance of the Database class
    const database = new Database();

    // Call the createCampaign method to insert the campaign into the database
    await database.createCampaign(campaignName, type, variants, controlName, controlIdentifier);

    // Close the database connection
    database.destructor();

    res.status(201).json({ message: 'Campaign created successfully' });
  } catch (error) {
    const err = error as Error;
    rollbar.error('Error creating campaign:', err);
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'An error occurred while creating the campaign' });
  }
}
