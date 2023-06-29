import { CookieData } from "../types/CampaignCookies";

/**
 * Sends interaction event data to the backend.
 *
 * @param {any} data - The interaction event data to send.
 */
export function sendInteractionEvent(data: any, key: string): void {
    fetch('https://abtest.winfuture.mobi/data_collector/v1/user_interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem(key, 'true');
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

export async function runCampaigns(cookies: string) {
  const response = await fetch('https://abtest.winfuture.mobi/backend/v1/run_campaigns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cookies }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Server responded with status: ${response.status}. Message: ${errorData.message}`);
  }

  return await response.json();
}

  