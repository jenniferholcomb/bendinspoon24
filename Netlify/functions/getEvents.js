import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Store API key in Netlify environment variable

let cachedEvents = null;
let lastFetched = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24 * 2; // 2 days in milliseconds

export async function handler(event, context) {
  const location = 'Bend, OR';
  const numEvents = 5; // Always requesting 10 popular events

  const now = Date.now();
  const isCacheValid = cachedEvents && now - lastFetched < CACHE_DURATION;

  if (isCacheValid) {
    console.log('Serving from cache');
    return {
      statusCode: 200,
      body: JSON.stringify({ events: cachedEvents }),
    };
  }

  try {
    // OpenAI API call
    const openAiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Give me the ${numEvents} most popular events happening in ${location} in the next 30 days, and ${numEvents} events in the next 3 months that draw tourists.
      
            Return only a list of JavaScript-style dictionaries. Each dictionary should include the following keys: 
            - 'name': the event name (string)
            - 'date': a list of dates in 'YYYY-MM-DD' format (list of strings)
            - 'description': a short summary of the event (string)
            - 'month': a list of two-digit month numbers from the event's date(s) (list of strings)
            
            Do not include any explanation or narrative. Just return a plain array of dictionaries as described above. Also include any well-known musical artists performing in ${location} within the same timeframe, formatted the same way.`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const eventsFromOpenAI = openAiResponse.data.choices[0].message.content;

    cachedEvents = eventsFromOpenAI;
    lastFetched - now;

    const result = {
      events: eventsFromOpenAI,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('Error fetching events:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch event data.' }),
    };
  }
}

