export interface CookieData {
  assignedIdentifier: string;
  controlIdentifier: string;
  isControl: boolean;
  assignedId: number;
  campaignId: number;
  type: string;
}

export interface OriginalContentValue {
  content: string;
  campaignId: number;
  assignedId: number;
  isControl: boolean;
  controlIdentifier: string;
  controlPaths : string [];
}

export interface ApiResponseData {
  campaignCookies: { [key: string]: CookieData };
  message: string;
}
