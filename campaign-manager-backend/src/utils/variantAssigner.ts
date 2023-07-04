import { Campaign, CampaignCookie, Variants, Controls } from "../types";
import { Aggregates } from "./types";
import { Database } from "../database/database";
import { rollbar } from '../../index'; // adjust the path according to your project structure


function assignRandomVariant(campaign: Campaign, control: Controls, variants: Variants[]): CampaignCookie {
  // If there are no variants, assign the control variant
  if (!variants || variants.length === 0) {
    console.log('No variants found, assigning control variant');
    return {
      campaignId: campaign.id,
      assignedIdentifier: control.identifier,
      controlIdentifier: control.identifier,
      assignedId: control.id,
      type: campaign.type,
      isControl: true,
    };
  }

  // Otherwise, choose a random variant (including the control variant)
  const allVariants = [
    control,
    ...variants
  ];
  const assigned = allVariants[Math.floor(Math.random() * allVariants.length)];
  console.log(`Assigned variant: ${assigned.name}`);
  return {
    campaignId: campaign.id,
    assignedIdentifier: assigned.identifier,
    controlIdentifier: control.identifier,
    assignedId: assigned.id,
    isControl: assigned.id === control.id,
    type: campaign.type,
  };
}


function assignVariantBasedOnCTR(campaign: Campaign, control: Controls, variants: Variants[], controlAggregates: Aggregates, variantAggregates: Aggregates[]): CampaignCookie {
  // Calculate the total clicks and views for the control
  const controlTotalClicks = controlAggregates.totalClicks;
  const controlTotalViews = controlAggregates.totalViews;
  const controlCTR = controlTotalViews === 0 ? 0 : controlTotalClicks / controlTotalViews;

  // Calculate the total clicks and views for each variant and calculate the CTR
  const variantCTRs = variantAggregates.map(aggregate => {
    const totalClicks = aggregate.totalClicks;
    const totalViews = aggregate.totalViews;
    return totalViews === 0 ? 0 : totalClicks / totalViews;
  });

  // Combine the control CTR and variant CTRs
  const allCTRs = [controlCTR, ...variantCTRs];

  // Calculate the total CTR
  const totalCTR = allCTRs.reduce((sum, ctr) => sum + ctr, 0);

  // Generate a random number between 0 and the total CTR
  const randomNumber = Math.random() * totalCTR;

  // Find the assigned variant/control based on the generated random number and the CTR values
  let cumulativeCTR = 0;
  for (let i = 0; i < allCTRs.length; i++) {
    cumulativeCTR += allCTRs[i];
    if (randomNumber <= cumulativeCTR) {
      const assigned = i === 0 ? control : variants[i - 1];
      if (assigned) {
        console.log(`Assigned variant/control: ${assigned.name} with CTR: ${allCTRs[i]}`);
        return {
          campaignId: campaign.id,
          assignedIdentifier: assigned.identifier,
          controlIdentifier: control.identifier,
          assignedId: assigned.id,
          type: campaign.type,
          isControl: i === 0,
        };
      }
    }
  }

  rollbar.error('No variant was selected');
  console.error('No variant was selected');
  throw new Error('No variant was selected');
}

export async function assignVariantToUser(campaign: Campaign, control: Controls, variants: Variants[], db: Database): Promise<CampaignCookie> {
  // Fetch the confidence interval upper value for the campaign
  const confidenceIntervalUpper = await db.getConfidenceIntervalUpper(campaign.id);

  // If the confidence interval is null or less than or equal to 60, assign a random variant
  if (confidenceIntervalUpper === null || confidenceIntervalUpper <= 60) {
    rollbar.log('Confidence interval is null or less than or equal to 60, assigning a random variant');
    console.log('Confidence interval is null or less than or equal to 60, assigning a random variant');
    return assignRandomVariant(campaign, control, variants);
  }

  // If the confidence interval is greater than 60, fetch the aggregates and assign based on CTR
  if (confidenceIntervalUpper > 60) {
    // Get the aggregates for the control and variants from the aggregate table
    const controlAggregates = await db.getAggregateResults(control.id);
    const variantAggregates = await Promise.all(variants.map(variant => db.getAggregateResults(variant.id)));

    // Check if the aggregates for the control and variants are empty
    if (controlAggregates === null || variantAggregates.some(aggregate => aggregate === null || aggregate === undefined)) {    
      rollbar.log('No aggregates found, assigning control variant or a random variant');    
      console.log('No aggregates found, assigning control variant or a random variant');
      return assignRandomVariant(campaign, control, variants);
    }

    rollbar.log('Aggregates found and confidence interval is above 60% assigning based on CTR');
    console.log('Aggregates found and confidence interval is above 60% assigning based on CTR');
    return assignVariantBasedOnCTR(campaign, control, variants, controlAggregates, variantAggregates);
  }

  // Return a random variant as a default if other conditions are not met
  rollbar.log('No specific condition was met, assigning a random variant');
  console.log('No specific condition was met, assigning a random variant');
  return assignRandomVariant(campaign, control, variants);
}
