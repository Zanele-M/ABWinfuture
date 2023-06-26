export interface CampaignData {
  campaign_name: string;
  control_name: string;
  control_identifier: string;
  type: string;
  variants: Variant[];
}

export interface Variant {
  name: string;
  identifier: string;

}
export interface ControlResults {
  id: number;
  name: string;
  total_clicks: number;
  total_views: number;
  ctr: number;
}

export interface VariantResults {
  id: number;
  name: string;
  total_clicks: number;
  total_views: number;
  ctr: number;
}


export interface CampaignResultResponse {
  analysis_time: number;
  campaign_id: number;
  campaign_name: string;
  confidence_interval: number;
  control: ControlResults;
  date_created: string;
  status: string;
  variants: VariantResults[];
  winner: string;
}



export interface CheckElementResponse {
  exists: boolean;
}