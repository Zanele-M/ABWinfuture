import { CampaignResultResponse, CampaignData, CheckElementResponse } from './types';

/**
 * ABTestService is the service layer for all the API calls related to AB Testing.
 */
const ABTestService = {
  /**
   * Retrieves all campaign results.
   *
   * @returns A promise that resolves to the campaign result response.
   */
  async getAllCampaignResults(): Promise<CampaignResultResponse> {
    try {
      const response = await fetch(`https://abtest.winfuture.mobi/results/v1/get_results`);
      const data = await response.json();
      console.log('API Response:', data); 
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  /**
   * Creates a new campaign with the provided campaign data.
   *
   * @param campaignData - The data for the campaign to be created.
   * @returns A promise that resolves when the campaign is successfully created.
   */
  async createCampaign(campaignData: CampaignData): Promise<void> {
    try {
      console.log(`Creating campaign: ${campaignData.campaign_name}`);
      const response = await fetch(`https://abtest.winfuture.mobi/backend/create_campaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        throw new Error('Failed to create test');
      }
    } catch (error) {
      console.error('Error creating test:', error);
      throw error;
    }
  },

  /**
   * Pauses an active campaign.
   *
   * @param campaignId - The ID of the campaign to be paused.
   * @returns A promise that resolves when the campaign is successfully paused.
   */
  async pauseCampaign(campaignId: number): Promise<void> {
    try {
      const response = await fetch(`https://abtest.winfuture.mobi/backend/pause/${campaignId}`, {
        method: 'PUT'
      });
  
      if (!response.ok) {
        throw new Error('Failed to pause campaign');
      }
    } catch (error) {
      console.error('Error pausing campaign:', error);
      throw error;
    }
  },

  /**
   * Resumes a paused campaign.
   *
   * @param campaignId - The ID of the campaign to be resumed.
   * @returns A promise that resolves when the campaign is successfully resumed.
   */
  async resumeCampaign(campaignId: number): Promise<void> {
    try {
      const response = await fetch(`https://abtest.winfuture.mobi/backend/resume/${campaignId}`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error('Failed to resume campaign');
      }
    } catch (error) {
      console.error('Error resuming campaign:', error);
      throw error;
    }
  },

 /**
 * Checks if a particular element exists.
 *
 * @param {string} identifier - The identifier of the element.
 * @param {string} type - The type of the element.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the element exists.
 */
  async checkElementExistence(identifier: string, type: string): Promise<boolean> {
    const url = 'https://winfuture:betatest@dev7.winfuture.de:49443'
    try {
      const response = await fetch('https://abtest.winfuture.mobi/backend/check_element', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: identifier,
          type: type,
          url: url
        })
      });
      const data: CheckElementResponse = await response.json();

      console.log('Response data:', data); // Log the response data to inspect its structure
      if (data.elementExists !== undefined) {
        return data.elementExists;
      } else {
        throw new Error("Invalid response from the server.");
      }
    } catch (error) {
      console.error('Error checking element existence:', error);
      throw error;
    }
  },  
 }

export default ABTestService;
