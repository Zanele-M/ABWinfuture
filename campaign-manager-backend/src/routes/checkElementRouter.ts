import express from 'express';
import checkElementController from '../controllers/checkElementController';

// Create a new router
const router = express.Router();

// Define the route for creating a campaign
console.log('checkElementRouter.ts: Defining the route for checking if an element exists in the webiste');
router.get('/check_element/:type/:identifier', checkElementController);
// Export the router
export default router;