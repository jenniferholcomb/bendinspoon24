// netlify/functions/getSTRData.js

import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    const response = await fetch(`https://airdna1.p.rapidapi.com/properties?rapidapi-key=${process.env.VITE_API_KEY}&location=bend`);
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}