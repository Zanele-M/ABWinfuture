import axios from 'axios';
import { JSDOM } from 'jsdom';
import { rollbar } from '../index'; // adjust the path according to your project structure
import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';

/**
 * Middleware function to validate and sanitize the request payload for the checkElementExistence function.
 */
export const validateCheckElementExistence = [
    check('identifier').exists().isString().trim().escape(),
    check('type').exists().isIn(['headline', 'image']),
    check('url').exists().isURL(),
    (req: Request, res: Response, next: () => void) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

/**
 * Function to check if an element exists on the webpage.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
export const checkElementExistence = async (req: Request, res: Response) => {
    const type = req.body.type;
    const identifier = req.body.identifier;
    const url = req.body.url;

    // check if the required params and query are provided
    if (!identifier || !type || !url) {
        console.log('Missing required parameters or query.');
        return res.status(400).json({ error: 'Missing required parameters or query.' });
    }

    console.log('Identifier:', identifier);

    try {
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);
        const document = dom.window.document;
        let elementExists = false;

        if (type === 'headline') {
            elementExists = Array.from(document.querySelectorAll('a')).some(el => el.textContent && el.textContent.includes(identifier));
        } else if (type === 'image') {
            const imgSources = Array.from(document.querySelectorAll('img')).map(img => img.getAttribute('src'));
            elementExists = imgSources.includes(identifier);
        }

        console.log('Element exists:', elementExists);

        res.status(200).json({ elementExists })
    } catch (error) {
        const extra_data = { identifier, type, url };
        rollbar.error(`Error during website scraping: ${error}`, extra_data);
        console.error(`Error during website scraping: ${error}`);
        res.status(500).json({ error: 'An error occurred during website scraping.' });
    }
}


export default checkElementExistence;