import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { assignVariantToUser } from '../utils/variantAssigner';
import { getCampaignCookies } from '../utils/cookieManager';
import { Database } from '../database/database';
import { rollbar } from '../index'; // adjust the path according to your project structure


// Validate and sanitize cookies
export const validateCookies = [
  body('cookies').trim().escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      rollbar.error('Error running campaign:', errors);
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * runCampaignController - The controller function for running campaigns.
 * It assigns variants to users based on active campaigns, and returns updated cookies for each campaign.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const runCampaignController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    rollbar.log('Running campaign controller with request body:', req.body);
    console.log('Running campaign controller with request body:', req.body);

    const db = new Database();

    // Get the active campaigns from the database
    const activeCampaigns = await db.getActiveCampaigns();
    const activeCampaignIds = activeCampaigns.map((campaign) => campaign.id);
    let campaignCookies: { [campaignId: string]: string } = {};

    // Sanitize cookies
    if (req.body.cookies !== ''){
      campaignCookies = getCampaignCookies(req.body);

      // Remove campaign cookies that are not present in active campaigns
      for (const campaignId in campaignCookies) {
        if (!activeCampaignIds.includes(parseInt(campaignId, 10))) {
          console.log(`Removed campaign cookie for ${campaignId}`);
          delete campaignCookies[campaignId];
        }
      }

      // Get new campaigns (i.e., campaigns not present in the cookies)
      const newCampaigns = activeCampaigns.filter((campaign) => !campaignCookies.hasOwnProperty(campaign.id.toString()));

      // Assign variants and add campaigns to cookies for the new campaigns
      for (const campaign of newCampaigns) {
        console.log('Checking campaign:', campaign);
        const control = await db.getControlForCampaign(campaign.id);
        const variants = await db.getVariantsForCampaign(campaign.id);

        const campaignCookie = await assignVariantToUser(campaign, control, variants, db);
  
        if (campaignCookie) {
          // Convert the CampaignCookie object to a string
          const campaignCookieString = JSON.stringify(campaignCookie);
          campaignCookies[`${campaign.id}`] = campaignCookieString;     
        }
      }
    } else {
      // If campaign cookies are empty, assign variants for all active campaigns
      for (const campaign of activeCampaigns) {
        console.log('Checking campaign:', campaign);
        const control = await db.getControlForCampaign(campaign.id);
        const variants = await db.getVariantsForCampaign(campaign.id);
        const campaignCookie = await assignVariantToUser(campaign, control, variants, db);

        if (campaignCookie) {
          // Convert the CampaignCookie object to a string
          console.log(campaignCookie)

          const campaignCookieString = JSON.stringify(campaignCookie);
          campaignCookies[`${campaign.id}`] = campaignCookieString;
        }
      }
    }

    // Send the response with the updated campaign cookies
    console.log('Sending response with campaign cookies:', campaignCookies);
    res.status(200).json({ message: 'Cookies have been successfully updated', campaignCookies: campaignCookies });

  } catch (error) {
    const err = error as Error;
    rollbar.error('Error running campaign:', err);
    console.error('Error reading campaign cookies:', err);
    res.status(500).json({ error: 'An error occurred while reading campaign cookies' });
  }
}
