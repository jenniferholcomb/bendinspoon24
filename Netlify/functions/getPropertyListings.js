
// netlify/functions/getPropertyListings.js

export async function handler(event, context) {
  // Dynamically import node-fetch to avoid top-level await
  const fetch = (await import('node-fetch')).default;

  // Extract `singleId` from the query string parameters
  const { singleId } = event.queryStringParameters;

  // Check if `singleId` exists 
  if (!singleId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" }, 
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
      headers: { "Content-Type": "application/json; charset=utf-8" }, 
      body: JSON.stringify(jsonifiedResponse)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" }, 
      body: JSON.stringify({ error: error.message })
    };
  }
}
