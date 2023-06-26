"use strict";
// domManipulator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElementByXPath = void 0;
function getElementByXPath(xpath) {
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const element = result.singleNodeValue;
    return element instanceof Element ? element : null;
}
exports.getElementByXPath = getElementByXPath;
