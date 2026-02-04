import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: 'key.env' });

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.YOUR_API_KEY;
const START_DATE = '2025-01-01';
const END_DATE = '2025-01-07';

if (!API_KEY) {
  console.warn('WARNING: YOUR_API_KEY not set. Put YOUR_API_KEY=... in key.env');
}

app.get('/api/asteroids', async (req, res) => {
  const start = req.query.start || START_DATE;
  const end = req.query.end || END_DATE;
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }
    const data = await response.json();
    const neoData = data.near_earth_objects || {};
    const result = {};
    for (const date in neoData) {
      result[date] = neoData[date].map(a => ({
        name: a.name,
        hazardous: a.is_potentially_hazardous_asteroid,
      }));
    }
    for (const date in result) {
      console.log(`\nDate: ${date}`);
      result[date].forEach(a => console.log(`- Name: ${a.name}, Hazardous: ${a.hazardous}`));
    }
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Root route to show basic usage
app.get('/', (req, res) => {
  console.log('Received request for / from', req.ip || req.connection.remoteAddress);
  res.send('NASA NEO API: use /api/asteroids?start=YYYY-MM-DD&end=YYYY-MM-DD - example: /api/asteroids?start=2024-01-01&end=2024-01-07');
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
