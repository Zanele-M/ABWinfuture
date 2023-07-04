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
exports.runCampaign = void 0;
const utils_1 = require("../utils");
const originalContent = new Map();
function hideElements(cookies) {
    return __awaiter(this, void 0, void 0, function* () {
        let controlPaths = [];
        const parsedCookies = (0, utils_1.sanitizeCookies)(cookies);
        Object.values(parsedCookies).forEach((cookie) => {
            controlPaths = (0, utils_1.findOccurrences)('body', cookie.controlIdentifier);
            if (!controlPaths || controlPaths.length === 0) {
                console.warn('No control paths found for cookie: ', cookie);
                return;
            }
            controlPaths.forEach((path) => {
                const element = document.querySelector(path);
                if (element) {
                    let content;
                    if (element instanceof HTMLImageElement) {
                        content = element.src;
                    }
                    else {
                        content = element.innerHTML;
                    }
                    originalContent.set(cookie.campaignId, { content: content, assignedId: cookie.assignedId, controlIdentifier: cookie.controlIdentifier, controlPaths: controlPaths });
                    element.style.display = 'none';
                }
                else {
                    console.warn(`Element not found for path: ${path}`);
                }
            });
        });
    });
}
function restoreOriginalContent() {
    return __awaiter(this, void 0, void 0, function* () {
        originalContent.forEach((value, key) => {
            value.controlPaths.forEach((path) => {
                const element = document.querySelector(path);
                if (element) {
                    if (element instanceof HTMLImageElement) {
                        element.src = value.content;
                    }
                    else {
                        element.innerHTML = value.content;
                    }
                    element.style.display = '';
                }
            });
        });
    });
}
function runCampaign() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Running campaign...');
        if (!navigator.cookieEnabled || !(0, utils_1.checkBrowserSupport)()) {
            console.error('Cookies or Local storage are not supported in this browser. The campaign cannot run.');
            return;
        }
        try {
            const cookies = document.cookie;
            if (cookies) {
                console.warn('Found cookies');
                yield hideElements(cookies);
            }
            else {
                console.warn('No cookies found');
            }
            const timeout = (ms, promise) => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject(new Error('API request timed out'));
                    }, ms);
                    promise.then(resolve, reject);
                });
            };
            // Make API call
            try {
                const response = yield timeout(2000, (0, utils_1.runCampaigns)(cookies)); // 3 second timeout
                if (isApiResponseData(response)) {
                    console.log(JSON.stringify(response)); // Log campaignCookies
                    (0, utils_1.handleApiResponse)(response, originalContent);
                }
                else {
                    throw new Error('API response error: missing campaignCookies');
                }
            }
            catch (apiError) {
                console.error('API call failed: ', apiError);
                yield restoreOriginalContent();
            }
            console.log('Campaign execution completed successfully!');
        }
        catch (error) {
            console.error('Error executing campaign: ', error);
        }
    });
}
exports.runCampaign = runCampaign;
function isApiResponseData(obj) {
    return 'campaignCookies' in obj;
}
//# sourceMappingURL=runCampaign.js.map