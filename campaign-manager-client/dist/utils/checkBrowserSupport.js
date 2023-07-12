"use strict";
// utils/checkBrowserSupport.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBrowserSupport = void 0;
/**
 * This function checks whether the browser supports cookies and local storage.
 *
 * @returns {boolean} Returns true if both cookies and local storage are supported, false otherwise.
 */
function checkBrowserSupport() {
    let isSupported = true;
    // Check cookies
    if (!navigator.cookieEnabled) {
        console.error('Cookies are not enabled in this browser. The campaign cannot run.');
        isSupported = false;
    }
    // Check local storage
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
    }
    catch (e) {
        console.error('Local storage is not supported in this browser. The campaign cannot run.');
        isSupported = false;
    }
    return isSupported;
}
exports.checkBrowserSupport = checkBrowserSupport;
//# sourceMappingURL=checkBrowserSupport.js.map