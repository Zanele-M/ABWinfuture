"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbar = void 0;
const express_1 = __importDefault(require("express"));
const createCampaignRouter_1 = __importDefault(require("./routes/createCampaignRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const pauseCampaignRouter_1 = __importDefault(require("./routes/pauseCampaignRouter"));
const rollbar_1 = __importDefault(require("rollbar"));
const resumeCampaignRouter_1 = __importDefault(require("./routes/resumeCampaignRouter"));
const checkElementRouter_1 = __importDefault(require("./routes/checkElementRouter"));
const path = __importStar(require("path"));
dotenv_1.default.config({ path: path.resolve(__dirname, './.env') });
const isProd = process.env.NODE_ENV === 'production';
// Print the current environment
console.log(`Current environment: ${isProd ? 'production' : 'development'}`);
// Initialize Rollbar
exports.rollbar = new rollbar_1.default({
    accessToken: isProd ? process.env.ROLLBAR_TOKEN_PROD : process.env.ROLLBAR_TOKEN_DEV,
    captureUncaught: true,
    captureUnhandledRejections: true,
});
console.log("Rollbar Config", isProd ? process.env.ROLLBAR_TOKEN_PROD : process.env.ROLLBAR_TOKEN_DEV);
console.log("Database", isProd ? process.env.DB_PASSWORD_DEV : process.env.DB_PASSWORD_DEV);
console.log("User", isProd ? process.env.DB_USER_DEV : process.env.DB_USER_DEV);
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
app.use(pauseCampaignRouter_1.default);
app.use(resumeCampaignRouter_1.default);
app.use(checkElementRouter_1.default);
// Define the port
const port = 3000;
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
