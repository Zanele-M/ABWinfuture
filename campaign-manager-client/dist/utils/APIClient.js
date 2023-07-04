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
exports.runCampaigns = exports.sendInteractionEvent = void 0;
/**
 * Sends interaction event data to the backend.
 *
 * @param {any} data - The interaction event data to send.
 */
function sendInteractionEvent(data, key) {
    fetch('https://abtest.winfuture.mobi/data_collector/v1/user_interactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
        if ('error' in data) {
            console.log('Failure:', data);
        }
        else {
            localStorage.setItem(key, 'true');
            console.log('Success', data);
        }
    })
        .catch((error) => {
        console.error('Error:', error);
    });
}
exports.sendInteractionEvent = sendInteractionEvent;
function runCampaigns(cookies) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://abtest.winfuture.mobi/backend/v1/run_campaigns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cookies }),
        });
        if (!response.ok) {
            const errorData = yield response.json();
            throw new Error(`Server responded with status: ${response.status}. Message: ${errorData.message}`);
        }
        return yield response.json();
    });
}
exports.runCampaigns = runCampaigns;
//# sourceMappingURL=APIClient.js.map