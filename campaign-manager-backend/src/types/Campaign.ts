
export interface Campaign {
  id: number;
  name : string;
  status: string; 
  type: CampaignType; 
  created_at: string;
}

export interface CampaignCookie {
  campaignId: number;
  assignedIdentifier: string;
  controlIdentifier: string;
  assignedId: number;
  isControl: boolean;
  type: string;
}

export interface CampaignResults {
  id: number;
  campaign_id: number;
  p_value: number;
  winner_id: number;
  analysis_time: string;
  last_update: string;
  isControl: boolean | null;
}


export enum CampaignType {
  Headline = 'headline',
  Image = 'image',
  Custom = 'custom',
}


export enum CampaignStatus {
  Running = 'running',
  Paused = 'paused',
  Completed = 'completed',
}
