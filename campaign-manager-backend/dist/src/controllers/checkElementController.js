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
exports.checkElementExistence = exports.validateCheckElementExistence = void 0;
const axios_1 = __importDefault(require("axios"));
const jsdom_1 = require("jsdom");
const index_1 = require("../../index"); // adjust the path according to your project structure
const express_validator_1 = require("express-validator");
/**
 * Middleware function to validate and sanitize the request payload for the checkElementExistence function.
 */
exports.validateCheckElementExistence = [
    (0, express_validator_1.check)('controlIdentifier').exists().isString().trim().escape(),
    (0, express_validator_1.check)('type').exists().isIn(['headline', 'image']),
    (0, express_validator_1.check)('url').exists().isURL(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
/**
 * Function to check if an element exists on the webpage.
 */
const checkElementExistence = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.params.type;
    const identifier = req.params.identifier;
    const url = "https://winfuture.de/"; // use req.query for url
    // check if the required params and query are provided
    if (!identifier || !type || !url) {
        return res.status(400).json({ error: 'Missing required parameters or query.' });
    }
    try {
        const response = yield axios_1.default.get(url);
        const dom = new jsdom_1.JSDOM(response.data);
        const document = dom.window.document;
        let elementExists = false;
        if (type === 'headline') {
            elementExists = Array.from(document.querySelectorAll('a')).some(el => el.textContent && el.textContent.includes(identifier));
        }
        else if (type === 'image') {
            const imgSources = Array.from(document.querySelectorAll('img')).map(img => img.getAttribute('src'));
            elementExists = imgSources.includes(identifier);
        }
        res.status(200).json({ elementExists });
    }
    catch (error) {
        const extra_data = { identifier, type, url };
        index_1.rollbar.error(`Error during website scraping: ${error}`, extra_data);
        console.error(`Error during website scraping: ${error}`);
        res.status(500).json({ error: 'An error occurred during website scraping.' });
    }
});
exports.checkElementExistence = checkElementExistence;
exports.default = exports.checkElementExistence;
