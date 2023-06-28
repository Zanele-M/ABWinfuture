import { ApiResponseData, CookieData } from "../types/CampaignCookies";
import { addImpressionClickListener, checkBrowserSupport, findOccurrences, runCampaigns, handleApiResponse, sanitizeCookies } from "../utils";

const originalContent = new Map();

async function hideElements(cookies: string): Promise<void> {
  let controlPaths: string[] = [];
  const parsedCookies = sanitizeCookies(cookies);

  Object.values(parsedCookies).forEach((cookie: CookieData) => {
    controlPaths = findOccurrences('body', cookie.controlIdentifier);
    if (!controlPaths || controlPaths.length === 0) {
      console.warn('No control paths found for cookie: ', cookie);
      return;
    }
    
    controlPaths.forEach((path: string) => {
      const element = document.querySelector(path) as HTMLElement;
      if (element) {
        let content;
        if (element instanceof HTMLImageElement) {
          content = element.src;
        } else {
          content = element.innerHTML;
        }
        originalContent.set(cookie.campaignId, {content: content, assignedId: cookie.assignedId, controlIdentifier: cookie.controlIdentifier, controlPaths: controlPaths});
        element.style.display = 'none';
      } else {
        console.warn(`Element not found for path: ${path}`);
      }
    });
  });
}

async function restoreOriginalContent(): Promise<void> {
  originalContent.forEach((value, key) => {
    value.controlPaths.forEach((path: string) => {
      const element = document.querySelector(path) as HTMLElement;
      if (element) {
        if (element instanceof HTMLImageElement) {
          element.src = value.content;
        } else {
          element.innerHTML = value.content;
        }
        element.style.display = '';
      }
    });
  });
}

export async function runCampaign() {
  console.log('Running campaign...');

  if (!navigator.cookieEnabled || !checkBrowserSupport()) {
    console.error('Cookies or Local storage are not supported in this browser. The campaign cannot run.');
    return;
  }

  try {
    const cookies = document.cookie;
    
    if (cookies) {
      console.warn('Found cookies');
      await hideElements(cookies);
    } else {
      console.warn('No cookies found');
    }

    const timeout = (ms: number | undefined, promise: Promise<any>) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('API request timed out'));
        }, ms);
        promise.then(resolve, reject);
      });
    }

    // Make API call
    try {
      const response = await timeout(1000, runCampaigns(cookies)); // 3 second timeout
      if (isApiResponseData(response)) {
        console.log(JSON.stringify(response));  // Log campaignCookies
        handleApiResponse(response, originalContent);
      } else {
        throw new Error('API response error: missing campaignCookies');
      }
    } 
     catch (apiError) {
      console.error('API call failed: ', apiError);
      await restoreOriginalContent();
    }
    console.log('Campaign execution completed successfully!');
  } catch (error) {
    console.error('Error executing campaign: ', error);
  }
}

function isApiResponseData(obj: any): obj is ApiResponseData {
  return 'campaignCookies' in obj;
}
