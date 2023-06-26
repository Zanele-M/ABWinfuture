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
const cheerio_1 = __importDefault(require("cheerio"));
const index_1 = require("../index"); // adjust the path according to your project structure
const express_validator_1 = require("express-validator");
/**
 * Middleware function to validate and sanitize the request payload for the checkElementExistence function.
 *
 * @name validateCheckElementExistence
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 *
 * @throws {Object} - Returns a 400 error response with an array of error objects if validation fails.
 *
 * @example
 * router.post('/api/v1/check_element', validateCheckElementExistence, checkElementExistence);
 */
exports.validateCheckElementExistence = [
    // Check if 'controlIdentifier' exists in the request and is a string
    // Trims and escapes 'controlIdentifier' to sanitize the input
    (0, express_validator_1.check)('controlIdentifier').exists().isString().trim().escape(),
    // Check if 'type' exists in the request and is either 'headline' or 'image'
    (0, express_validator_1.check)('type').exists().isIn(['headline', 'image']),
    // Middleware function to handle validation result
    (req, res, next) => {
        // Extract the validation errors from a request
        const errors = (0, express_validator_1.validationResult)(req);
        // If there are validation errors, return a 400 error response with the errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // If there are no validation errors, proceed to the next middleware function (or the controller, if there are no more middleware functions)
        next();
    },
];
/**
 * Function to check if an element exists on the webpage.
 *
 * @param {string} controlIdentifier - The identifier of the control element.
 *   For headlines, this is the text of the headline.
 *   For images, this is the source URL of the image.
 * @param {string} type - The type of the control element (i.e., 'headline' or 'image').
 * @returns {boolean} - Returns true if the element exists on the webpage, false otherwise.
 *
 * @throws {Error} - Throws an error if an issue arises during website scraping.
 */
const checkElementExistence = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { controlIdentifier, type } = req.body;
    try {
        const { data } = yield axios_1.default.get('https://www.winfuture.de');
        const $ = cheerio_1.default.load(data);
        let elementExists = false;
        if (type === 'headline') {
            elementExists = $('*').toArray().some(el => $(el).text().includes(controlIdentifier));
        }
        else if (type === 'image') {
            const imgSources = $('img').map((i, img) => $(img).attr('src')).get();
            elementExists = imgSources.includes(controlIdentifier);
        }
        // Respond with the result
        res.status(200).json({ elementExists });
    }
    catch (error) {
        const extra_data = { controlIdentifier, type };
        index_1.rollbar.error(`Error during website scraping: ${error}`, extra_data);
        console.error(`Error during website scraping: ${error}`);
        // Respond with error status and message
        res.status(500).json({ error: 'An error occurred during website scraping.' });
    }
});
exports.checkElementExistence = checkElementExistence;
exports.default = exports.checkElementExistence;
