import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Store API key in Netlify environment variable
const OTHER_API_KEY = process.env.OTHER_API_KEY;   // Another API key for a different service

export async function handler(event, context) {
  const location = 'Bend, OR';
  const numEvents = 10; // Always requesting 10 popular events

  try {
    // OpenAI API call
    const openAiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Give me the ${numEvents} most popular events happening in ${location} in key-value format where the key is the event name and the value is a short description.`,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("OpenAI Key:", OPENAI_API_KEY);

    const eventsFromOpenAI = openAiResponse.data.choices[0].message.content;

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

