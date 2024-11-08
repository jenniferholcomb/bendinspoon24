// netlify/functions/getWeather.js

import fetch from 'node-fetch';

export async function handler(event, context) {
  console.log('were connected to function');

  try {
    const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=Bend,OR&key=${process.env.API_KEY_WEATHER}&units=I&days=7`);
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

