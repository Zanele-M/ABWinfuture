import express from 'express';
import  router  from './src/routes/createCampaignRouter';
const app = express();
const port = 5000;

app.use(express.json());

// Routes
app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
