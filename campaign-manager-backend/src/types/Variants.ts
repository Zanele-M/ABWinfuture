export interface Variants {
  id  : number;
  campaignId: number;
  name: string;
  identifier: string;
}

export interface VariantResults {
  campaignId: number;
  id: number;
  variantId: number;
  confidenceIntervalUpper: number;
  confidenceIntervalLower: number;
  lastUpdated: string;
}
