import axios from 'axios';
import cheerio from 'cheerio';
import { rollbar } from '../index'; // adjust the path according to your project structure
import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';

/**
 * Middleware function to validate and sanitize the request payload for the checkElementExistence function.
 */
export const validateCheckElementExistence = [
    check('controlIdentifier').exists().isString().trim().escape(),
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
 */
export const checkElementExistence = async (req: Request, res: Response) => {
    const { identifier, type } = req.params; // use req.params instead of req.body
    const url = req.query.url as string; // use req.query for url

    // check if the required params and query are provided
    if (!identifier || !type || !url) {
        return res.status(400).json({ error: 'Missing required parameters or query.' });
    }

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let elementExists = false;

        if (type === 'headline') {
            elementExists = $('a').toArray().some(el => $(el).text().includes(identifier));
        } else if (type === 'image') {
            const imgSources = $('img').map((i, img) => $(img).attr('src')).get();
            elementExists = imgSources.includes(identifier);
        }

        res.status(200).json({ elementExists });

    } catch (error) {
        const extra_data = { identifier, type, url };
        rollbar.error(`Error during website scraping: ${error}`, extra_data);
        console.error(`Error during website scraping: ${error}`);
        res.status(500).json({ error: 'An error occurred during website scraping.' });
    }
}

export default checkElementExistence;