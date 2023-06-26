import { CookieData } from "../types/CampaignCookies";

/**
 * Sanitize and parse cookies
 * @param cookies - Cookie string
 * @returns Parsed cookies
 */
export function sanitizeCookies(cookies: string): { [key: string]: CookieData } {
    console.log('Sanitizing cookies...');
  
    const parsedCookies: { [key: string]: CookieData } = cookies !== ''
      ? cookies.split("; ").reduce((acc: { [key: string]: CookieData }, cookie: string) => {
          const [name, value] = cookie.split('=');
          try {
            const sanitizedValue: CookieData = JSON.parse(decodeURIComponent(value));
  
            // Validate each property in the cookie to ensure it conforms to the CampaignCookie interface
            if (
              'campaignId' in sanitizedValue &&
              'assignedIdentifier' in sanitizedValue &&
              'controlIdentifier' in sanitizedValue &&
              'assignedId' in sanitizedValue &&
              'isControl' in sanitizedValue &&
              'type' in sanitizedValue
            ) {
              acc[name] = sanitizedValue;
            }
          } catch (e) {
            console.warn(`Error parsing cookie: ${name}`);
          }
  
          return acc;
        }, {})
      : {};
  
    console.log('Cookies sanitized successfully!');
  
    return parsedCookies;
  }