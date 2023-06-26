
// ICampaignCookie.ts
  export interface CampaignCookie {
    campaignName: string;
    choosenvariancename: string;
    choosenvariancecontent: string;
    controlXpath: string;
    type: string;   
    isControl: boolean;
  }

  export interface Aggregates {
    id: number;
    assignedId: number;
    totalClicks: number;
    totalViews: number;
    ctr: number;
    lastUpdated: Date;
  }