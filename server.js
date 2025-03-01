const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Updated CORS configuration for Vercel deployment
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://real-estate-frontend-pied.vercel.app'  // Add your frontend Vercel URL
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/companies', require('./routes/companies'));
app.use('/api/channelPartners', require('./routes/channelPartners'));
app.use('/api/leads', require('./routes/leads'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
