// netlify/functions/getPropertyListings.js

const fetch = require('node-fetch');

export async function handler(event, context) {
  // Extract `singleId` from the query string parameters
  const { singleId } = event.queryStringParameters;

  // Check if `singleId` exists
  if (!singleId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "singleId is required" })
    };
  }

  try {
    // Make the API call using the singleId
    const response = await fetch(`https://airbnb-listings.p.rapidapi.com/v2/listingAvailabilityFull?id=${singleId}&rapidapi-key=${process.env.API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    
    const jsonifiedResponse = await response.json();

    // Return the JSON response
    return {
      statusCode: 200,
      body: JSON.stringify(jsonifiedResponse)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
