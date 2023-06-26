import { runCampaign } from "./client/runCampaign";

// Run the campaign when the page has finished loading
window.addEventListener('load', async () => {
  try {
    await runCampaign();
  } catch (error) {
    console.error('Error executing campaign: ', error);
  }
});
