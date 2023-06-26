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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariantResults = exports.getControlResults = exports.getControlForCampaign = exports.getVariantsForCampaign = exports.getActiveCampaigns = exports.getCampaigns = exports.createCampaign = void 0;
const database_1 = require("../database/database");
function createCampaign(campaign) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = new database_1.Database();
        yield db.insert('campaigns', campaign);
        db.destructor();
        return campaign;
    });
}
exports.createCampaign = createCampaign;
function getCampaigns() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = new database_1.Database();
        const campaigns = yield db.getCampaigns();
        db.destructor();
        return campaigns;
    });
}
exports.getCampaigns = getCampaigns;
function getActiveCampaigns() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = new database_1.Database();
        const campaigns = yield db.getActiveCampaigns();
        db.destructor();
        return campaigns;
    });
}
exports.getActiveCampaigns = getActiveCampaigns;
function getVariantsForCampaign(campaignId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = new database_1.Database();
        const variants = yield db.getVariantsForCampaign(campaignId);
        db.destructor();
        return variants;
    });
}
exports.getVariantsForCampaign = getVariantsForCampaign;
function getControlForCampaign(campaignId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = new database_1.Database();
        const control = yield db.getControlForCampaign(campaignId);
        db.destructor();
        return control;
    });
}
exports.getControlForCampaign = getControlForCampaign;
function getControlResults(controlId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = new database_1.Database();
        const control = yield db.getControlResults(controlId);
        db.destructor();
        return control;
    });
}
exports.getControlResults = getControlResults;
function getVariantResults(variantId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = new database_1.Database();
        const variant = yield db.getVariantResults(variantId);
        db.destructor();
        return variant;
    });
}
exports.getVariantResults = getVariantResults;
