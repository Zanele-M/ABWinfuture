export interface Controls {
    id : number;
    campaignId: number;
    name: string;
    identifier: string;
  }

  
export interface ControlResults {
  campaignId: number;
  id: number;
  controlId: number;
  confidenceIntervalUpper: number;
  confidenceIntervalLower: number;
  lastUpdated: string;
} 
