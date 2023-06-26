import { CookieData } from "../types/CampaignCookies";

/**
 * Sends interaction event data to the backend.
 *
 * @param {any} data - The interaction event data to send.
 */
export function sendInteractionEvent(data: any): void {
    fetch('http://localhost:5003/user_interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

export async function runCampaigns(cookies: string) {
  const response = await fetch('http://localhost:3000/api/v1/runCampaigns', {
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

  