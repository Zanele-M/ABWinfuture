var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * ABTestService is the service layer for all the API calls related to AB Testing.
 */
var ABTestService = {
    /**
     * Retrieves all campaign results.
     *
     * @returns A promise that resolves to the campaign result response.
     */
    getAllCampaignResults: function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("https://abtest.winfuture.mobi/results/v1/get_results")];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        console.log('API Response:', data);
                        return [2 /*return*/, data];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error fetching data:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Creates a new campaign with the provided campaign data.
     *
     * @param campaignData - The data for the campaign to be created.
     * @returns A promise that resolves when the campaign is successfully created.
     */
    createCampaign: function (campaignData) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("Creating campaign: ".concat(campaignData.campaign_name));
                        return [4 /*yield*/, fetch("https://abtest.winfuture.mobi/backend/v1/create_campaign", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(campaignData),
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Failed to create test');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error creating test:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Pauses an active campaign.
     *
     * @param campaignId - The ID of the campaign to be paused.
     * @returns A promise that resolves when the campaign is successfully paused.
     */
    pauseCampaign: function (campaignId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch("https://abtest.winfuture.mobi/backend/v1/campaigns/".concat(campaignId, "/pause"), {
                                method: 'PUT'
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Failed to pause campaign');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error pausing campaign:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Resumes a paused campaign.
     *
     * @param campaignId - The ID of the campaign to be resumed.
     * @returns A promise that resolves when the campaign is successfully resumed.
     */
    resumeCampaign: function (campaignId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch("https://abtest.winfuture.mobibackend/v1/campaigns/".concat(campaignId, "/resume"), {
                                method: 'PUT'
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Failed to resume campaign');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error resuming campaign:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Checks if a particular element exists.
     *
     * @param identifier - The identifier of the element.
     * @param type - The type of the element.
     * @returns A promise that resolves to a boolean indicating whether the element exists.
     */
    //   async checkElementExistence(identifier: string, type: string): Promise<boolean> {
    //     const url = 'http://192.168.0.138:8084/hello.html'
    //     try {
    //       const response = await fetch(`https://abtest.winfuture.mobi/backend/v1/check_element/${url}/${type}/${identifier}`);
    //       const data: CheckElementResponse = await response.json();
    //       if (data.exists !== undefined) {
    //         return data.exists;
    //       } else {
    //         throw new Error("Invalid response from the server.");
    //       }
    //     } catch (error) {
    //       console.error('Error checking element existence:', error);
    //       throw error;
    //     }
    //   },
};
export default ABTestService;
