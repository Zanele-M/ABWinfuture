"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignStatus = exports.CampaignType = void 0;
var CampaignType;
(function (CampaignType) {
    CampaignType["Headline"] = "headline";
    CampaignType["Image"] = "image";
    CampaignType["Custom"] = "custom";
})(CampaignType = exports.CampaignType || (exports.CampaignType = {}));
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["Running"] = "running";
    CampaignStatus["Paused"] = "paused";
    CampaignStatus["Completed"] = "completed";
})(CampaignStatus = exports.CampaignStatus || (exports.CampaignStatus = {}));
