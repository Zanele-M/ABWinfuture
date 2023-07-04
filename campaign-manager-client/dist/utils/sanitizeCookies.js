"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeCookies = void 0;
/**
 * Sanitize and parse cookies
 * @param cookies - Cookie string
 * @returns Parsed cookies
 */
function sanitizeCookies(cookies) {
    console.log('Sanitizing cookies...');
    const parsedCookies = cookies !== ''
        ? cookies.split("; ").reduce((acc, cookie) => {
            const [name, value] = cookie.split('=');
            try {
                const sanitizedValue = JSON.parse(decodeURIComponent(value));
                // Validate each property in the cookie to ensure it conforms to the CampaignCookie interface
                if ('campaignId' in sanitizedValue &&
                    'assignedIdentifier' in sanitizedValue &&
                    'controlIdentifier' in sanitizedValue &&
                    'assignedId' in sanitizedValue &&
                    'isControl' in sanitizedValue &&
                    'type' in sanitizedValue) {
                    acc[name] = sanitizedValue;
                }
            }
            catch (e) {
                console.warn(`Error parsing cookie: ${name}`);
            }
            return acc;
        }, {})
        : {};
    console.log('Cookies sanitized successfully!');
    return parsedCookies;
}
exports.sanitizeCookies = sanitizeCookies;
//# sourceMappingURL=sanitizeCookies.js.map