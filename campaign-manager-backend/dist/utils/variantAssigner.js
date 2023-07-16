"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignVariantToUser = void 0;
const index_1 = require("../index"); // adjust the path according to your project structure
const jstat_1 = __importDefault(require("jstat")); // You'll need to install this library
function assignRandomVariant(campaign, control, variants) {
    const allVariants = [control, ...variants];
    const assigned = allVariants[Math.floor(Math.random() * allVariants.length)];
    index_1.rollbar.log(`Assigned variant: ${assigned.name}`);
    return {
        campaignId: campaign.id,
        assignedIdentifier: assigned.identifier,
        controlIdentifier: control.identifier,
        assignedId: assigned.id,
        isControl: assigned.id === control.id,
        type: campaign.type,
    };
}
function assignVariantBasedOnThompsonSampling(campaign, control, variants, db) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const controlAggregates = yield db.getAggregateResults(control.id);
            const variantAggregates = yield Promise.all(variants.map(variant => db.getAggregateResults(variant.id)));
            if (controlAggregates === null || variantAggregates.some(aggregate => aggregate === null || aggregate === undefined)) {
                index_1.rollbar.log('No aggregates found, assigning control variant or a random variant');
                return assignRandomVariant(campaign, control, variants);
            }
            const allClicksAndViews = [
                { totalClicks: controlAggregates.totalClicks, totalViews: controlAggregates.totalViews },
                ...variantAggregates.map(aggregate => ({ totalClicks: aggregate.totalClicks, totalViews: aggregate.totalViews })),
            ];
            const sampledCTRs = allClicksAndViews.map(({ totalClicks, totalViews }, index) => {
                const alpha = totalClicks + 1;
                const beta = totalViews - totalClicks + 1;
                const sampledCTR = jstat_1.default.beta.sample(alpha, beta);
                index_1.rollbar.log(`Distribution values for ${index === 0 ? 'control' : 'variant ' + index}: alpha=${alpha}, beta=${beta}, sampledCTR=${sampledCTR}`);
                return sampledCTR;
            });
            const maxSampledCTR = Math.max(...sampledCTRs);
            const assignedIndex = sampledCTRs.indexOf(maxSampledCTR);
            const assigned = assignedIndex === 0 ? control : variants[assignedIndex - 1];
            index_1.rollbar.log(`Assigned variant/control: ${assigned.name} with sampled CTR: ${maxSampledCTR}`);
            let assignedIdentifier = assigned.identifier;
            let controlIdentifier = assigned.identifier;
            if (campaign.type === 'custom') {
                assignedIdentifier = "";
                controlIdentifier = "";
            }
            return {
                campaignId: campaign.id,
                assignedIdentifier: assignedIdentifier,
                controlIdentifier: controlIdentifier,
                assignedId: assigned.id,
                type: campaign.type,
                isControl: assignedIndex === 0,
            };
        }
        catch (error) {
            index_1.rollbar.error(`Failed to assign variant based on Thompson Sampling: ${error}`);
            throw error;
        }
    });
}
function assignVariantToUser(campaign, control, variants, db) {
    return __awaiter(this, void 0, void 0, function* () {
        const confidenceIntervalUpper = yield db.getConfidenceIntervalUpper(campaign.id);
        if (confidenceIntervalUpper === null || confidenceIntervalUpper <= 60) {
            index_1.rollbar.log('Confidence interval is null or less than or equal to 60, assigning a random variant');
            return assignRandomVariant(campaign, control, variants);
        }
        if (confidenceIntervalUpper > 60) {
            index_1.rollbar.log('Confidence interval is above 60%, assigning based on Thompson Sampling');
            return assignVariantBasedOnThompsonSampling(campaign, control, variants, db);
        }
        index_1.rollbar.log('No specific condition was met, assigning a random variant');
        return assignRandomVariant(campaign, control, variants);
    });
}
exports.assignVariantToUser = assignVariantToUser;
