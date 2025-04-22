// Netlify/functions/getWeather.js

export async function handler(event, context) {
  // Dynamically import node-fetch to avoid top-level await
  const fetch = (await import('node-fetch')).default;

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

