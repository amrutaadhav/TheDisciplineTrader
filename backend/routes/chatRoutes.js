const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

router.post('/', async (req, res) => {
  const { messages } = req.body;
  
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    return res.status(500).json({ error: 'Groq API key is missing. Please add it to your .env file.' });
  }

  try {
    const openai = new OpenAI({ 
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    });
    
    const systemPrompt = {
      role: 'system',
      content: 'You are an elite financial trading mentor for "The Discipline Trader". Your goal is to help users maintain strict discipline, follow their trading plan, and analyze market setups. Do not give direct financial advice, but rather evaluate technicals based on price action and discipline.'
    };
    
    // Check if the latest message has an image and format it for GPT-4o vision
    const formattedMessages = messages.map(msg => {
      if (msg.image) {
        return {
          role: msg.role,
          content: [
            { type: 'text', text: msg.content },
            { type: 'image_url', image_url: { url: msg.image } }
          ]
        };
      }
      // If the backend receives an array content from the frontend, pass it directly
      if (Array.isArray(msg.content)) {
        return msg;
      }
      return { role: msg.role, content: msg.content };
    });
    
    const apiMessages = [systemPrompt, ...formattedMessages];

    const response = await openai.chat.completions.create({
      model: 'llama-3.2-11b-vision-preview',
      messages: apiMessages,
      max_tokens: 500,
    });

    res.json(response.choices[0].message);
  } catch (error) {
    console.error('OpenAI Error:', error);
    const errorMessage = error.message || 'Failed to communicate with the trading assistant.';
    res.status(500).json({ error: errorMessage });
  }
});

module.exports = router;
