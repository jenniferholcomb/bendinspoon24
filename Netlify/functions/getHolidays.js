// netlify/functions/getHolidays.js

export async function handler(event, context) {
  // Dynamically import node-fetch to avoid top-level await
  const fetch = (await import('node-fetch')).default;

  try {
    const response = await fetch(`https://calendarific.com/api/v2/holidays?&api_key=${process.env.API_KEY_HOLIDAY}&country=US&year=${year}`);
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
