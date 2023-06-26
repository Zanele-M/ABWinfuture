import axios from 'axios';
import cheerio from 'cheerio';
import { rollbar } from '../index'; // adjust the path according to your project structure
import { Request, Response } from 'express';
import { ValidationError, check, validationResult } from 'express-validator';

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
export const validateCheckElementExistence = [
    // Check if 'controlIdentifier' exists in the request and is a string
    // Trims and escapes 'controlIdentifier' to sanitize the input
    check('controlIdentifier').exists().isString().trim().escape(),

    // Check if 'type' exists in the request and is either 'headline' or 'image'
    check('type').exists().isIn(['headline', 'image']),

    // Middleware function to handle validation result
    (req: Request, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { errors: ValidationError[]; }): any; new(): any; }; }; }, next: () => void) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

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
export const checkElementExistence = async (req: Request, res: Response) => {
    const { controlIdentifier, type } = req.body;

    try {
        const { data } = await axios.get('https://www.winfuture.de');

        const $ = cheerio.load(data);

        let elementExists = false;

        if (type === 'headline') {
            elementExists = $('*').toArray().some(el => $(el).text().includes(controlIdentifier));
        } else if (type === 'image') {
            const imgSources = $('img').map((i, img) => $(img).attr('src')).get();
            elementExists = imgSources.includes(controlIdentifier);
        }

        // Respond with the result
        res.status(200).json({ elementExists });

    } catch (error) {
        const extra_data = { controlIdentifier, type };
        rollbar.error(`Error during website scraping: ${error}`, extra_data);
        console.error(`Error during website scraping: ${error}`);
        // Respond with error status and message
        res.status(500).json({ error: 'An error occurred during website scraping.' });
    }
}

export default checkElementExistence;