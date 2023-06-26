"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbar = void 0;
const express_1 = __importDefault(require("express"));
const runCampaignRouter_1 = __importDefault(require("./routes/runCampaignRouter"));
const createCampaignRouter_1 = __importDefault(require("./routes/createCampaignRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const pauseCampaignRouter_1 = __importDefault(require("./routes/pauseCampaignRouter"));
const rollbar_1 = __importDefault(require("rollbar"));
const resumeCampaignController_1 = require("./controllers/resumeCampaignController");
const checkElementController_1 = __importDefault(require("./controllers/checkElementController"));
dotenv_1.default.config();
const isProd = process.env.NODE_ENV === 'production';
// Print the current environment
console.log(`Current environment: ${isProd ? 'production' : 'development'}`);
// Initialize Rollbar
exports.rollbar = new rollbar_1.default({
    accessToken: isProd ? process.env.ROLLBAR_TOKEN_PROD : process.env.ROLLBAR_TOKEN_DEV,
    captureUncaught: true,
    captureUnhandledRejections: true,
});
const app = (0, express_1.default)();
// Add CORS middleware with custom options
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
}));
app.use(express_1.default.json());
// Add Rollbar request handler to ensure request context is attached to all events
// Use Rollbar error handler to send exceptions to your rollbar account
app.use(exports.rollbar.errorHandler());
// Use your routers in the application
app.use(createCampaignRouter_1.default);
app.use(runCampaignRouter_1.default);
app.use(pauseCampaignRouter_1.default);
app.use(resumeCampaignController_1.resumeCampaignController);
app.use(checkElementController_1.default);
// Define the port
const port = 3000;
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
