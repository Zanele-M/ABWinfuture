import { Campaign, CampaignCookie, Variants, Controls } from "../types";
import { Aggregates } from "./types";
import { Database } from "../database/database";
import { rollbar } from '../index'; // adjust the path according to your project structure
import jStat from 'jstat'; // You'll need to install this library

function assignRandomVariant(campaign: Campaign, control: Controls, variants: Variants[]): CampaignCookie {
  const allVariants = [control, ...variants];
  const assigned = allVariants[Math.floor(Math.random() * allVariants.length)];
  rollbar.log(`Assigned variant: ${assigned.name}`);
  return {
    campaignId: campaign.id,
    assignedIdentifier: assigned.identifier,
    controlIdentifier: control.identifier,
    assignedId: assigned.id,
    isControl: assigned.id === control.id,
    type: campaign.type,
  };
}

async function assignVariantBasedOnThompsonSampling(campaign: Campaign, control: Controls, variants: Variants[], db: Database): Promise<CampaignCookie> {
  try {
    const controlAggregates = await db.getAggregateResults(control.id);
    const variantAggregates = await Promise.all(variants.map(variant => db.getAggregateResults(variant.id)));

    if (controlAggregates === null || variantAggregates.some(aggregate => aggregate === null || aggregate === undefined)) {    
      rollbar.log('No aggregates found, assigning control variant or a random variant');
      return assignRandomVariant(campaign, control, variants);
    }

    const allClicksAndViews = [
      { totalClicks: controlAggregates.totalClicks, totalViews: controlAggregates.totalViews },
      ...variantAggregates.map(aggregate => ({ totalClicks: aggregate.totalClicks, totalViews: aggregate.totalViews })),
    ];

    const sampledCTRs = allClicksAndViews.map(({ totalClicks, totalViews }) => {
      const alpha = totalClicks + 1;
      const beta = totalViews - totalClicks + 1;
      return jStat.beta.sample(alpha, beta);
    });

    const maxSampledCTR = Math.max(...sampledCTRs);
    const assignedIndex = sampledCTRs.indexOf(maxSampledCTR);
    const assigned = assignedIndex === 0 ? control : variants[assignedIndex - 1];

    rollbar.log(`Assigned variant/control: ${assigned.name} with sampled CTR: ${maxSampledCTR}`);
    return {
      campaignId: campaign.id,
      assignedIdentifier: assigned.identifier,
      controlIdentifier: control.identifier,
      assignedId: assigned.id,
      type: campaign.type,
      isControl: assignedIndex === 0,
    };
  } catch (error) {
    rollbar.error(`Failed to assign variant based on Thompson Sampling: ${error}`);
    throw error;
  }
}

export async function assignVariantToUser(campaign: Campaign, control: Controls, variants: Variants[], db: Database): Promise<CampaignCookie> {
  const confidenceIntervalUpper = await db.getConfidenceIntervalUpper(campaign.id);

  if (confidenceIntervalUpper === null || confidenceIntervalUpper <= 60) {
    rollbar.log('Confidence interval is null or less than or equal to 60, assigning a random variant');
    return assignRandomVariant(campaign, control, variants);
  }

  if (confidenceIntervalUpper > 60) {
    rollbar.log('Confidence interval is above 60%, assigning based on Thompson Sampling');
    return assignVariantBasedOnThompsonSampling(campaign, control, variants, db);
  }

  rollbar.log('No specific condition was met, assigning a random variant');
  return assignRandomVariant(campaign, control, variants);
}
