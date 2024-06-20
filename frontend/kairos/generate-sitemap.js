const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { SitemapStream, streamToPromise } = require('sitemap');
require('dotenv').config(); // Load environment variables from .env file

// Get hostname from environment variables
const hostname = process.env.REACT_APP_HOSTNAME || 'http://kairos.gr';
const apiUrl = `${hostname}/api/places-with-urls/`;

if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Function to fetch weather places data
async function fetchWeatherPlaces() {
  try {
    const response = await axios.get(apiUrl);
    console.log('Fetched weather places data:', response.data); // Log fetched data
    return response.data;
  } catch (error) {
    console.error('Error fetching weather places:', error);
    return [];
  }
}

async function generateSitemap() {
  // Default list of URLs to include in the sitemap
  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/contact', changefreq: 'monthly', priority: 0.8 },
    // Add more URLs as needed
  ];

  // Fetch weather places data
  const weatherPlaces = await fetchWeatherPlaces();

  // Ensure weather places data is an array
  if (!Array.isArray(weatherPlaces)) {
    console.error('Expected an array of weather places but got:', typeof weatherPlaces);
    return;
  }

  // Log the weather places data structure for verification
  console.log('Weather places data structure:', JSON.stringify(weatherPlaces, null, 2));

  // Add weather places to the links
  weatherPlaces.forEach(place => {
    const url = place.url;
    if (url) {
      console.log('Adding URL to sitemap:', url); // Log added URLs
      links.push({ url, changefreq: 'daily', priority: 0.9 });
    } else {
      console.warn('URL generation failed for place:', place);
    }
  });

  // Create a stream to write to
  const sitemap = new SitemapStream({ hostname });

  // Write each link to the sitemap
  links.forEach(link => sitemap.write(link));
  sitemap.end();

  // Convert the stream to a promise and write the file
  streamToPromise(sitemap).then(sm => {
    const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sm.toString());
    console.log(`Sitemap written successfully to ${sitemapPath}`);
  }).catch(console.error);
}

generateSitemap();
