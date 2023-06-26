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
      const response = await fetch(`http://localhost:5008/v1/get_results`);
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
      const response = await fetch(`http://localhost:3000/api/v1/create_campaign`, {
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
      const response = await fetch(`http://localhost:3000/api/v1/campaigns/${campaignId}/pause`, {
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
      const response = await fetch(`http://localhost:3000/api/v1/campaigns/${campaignId}/resume`, {
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
   * @param identifier - The identifier of the element.
   * @param type - The type of the element.
   * @returns A promise that resolves to a boolean indicating whether the element exists.
   */
  async checkElementExistence(identifier: string, type: string): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:5008/v1/check_element_existence/${type}/${identifier}`);
      const data: CheckElementResponse = await response.json();
      if (data.exists !== undefined) {
        return data.exists;
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
