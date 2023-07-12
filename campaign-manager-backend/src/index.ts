import express from 'express';
import runCampaignRouter from './routes/runCampaignRouter';
import createCampaignRouter from './routes/createCampaignRouter';
import dotenv from 'dotenv';
import cors from 'cors';
import pauseCampaignRouter from './routes/pauseCampaignRouter';
import Rollbar from 'rollbar';
import resumeCampaignRouter from './routes/resumeCampaignRouter';
import checkElementRouter from './routes/checkElementRouter';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

// Print the current environment
console.log(`Current environment: ${isProd ? 'production' : 'development'}`);

// Initialize Rollbar
export const rollbar = new Rollbar({
  accessToken: isProd ? process.env.ROLLBAR_TOKEN_PROD : process.env.ROLLBAR_TOKEN_DEV,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

console.log("Rollbar Config", isProd ? process.env.ROLLBAR_TOKEN_PROD : process.env.ROLLBAR_TOKEN_DEV)
console.log("Database", isProd ? process.env.DB_PASSWORD_DEV : process.env.DB_PASSWORD_DEV)
console.log("User", isProd ? process.env.DB_USER_DEV : process.env.DB_USER_DEV)



const app = express();

// Add CORS middleware with custom options
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
  })
);

app.use(express.json());
// Add Rollbar request handler to ensure request context is attached to all events


// Use Rollbar error handler to send exceptions to your rollbar account
app.use(rollbar.errorHandler());

// Use your routers in the application
app.use(createCampaignRouter);
app.use(runCampaignRouter);
app.use(pauseCampaignRouter);
app.use(resumeCampaignRouter);
app.use(checkElementRouter);
// Define the port
const port = 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
