"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkElementController_1 = __importDefault(require("../controllers/checkElementController"));
// Create a new router
const router = express_1.default.Router();
// Define the route for creating a campaign
console.log('checkElementRouter.ts: Defining the route for checking if an element exists in the webiste');
router.get('/v1/:url/:type/:identifier/check_element', checkElementController_1.default);
// Export the router
exports.default = router;
