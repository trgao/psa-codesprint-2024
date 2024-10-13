// services/gptService.js
require('dotenv').config();
const axios = require('axios');

// Function to convert text to JSON with specific sections using GPT
async function parsePdfContentToSections(text) {
  try {
    console.log('PDF Text Length:', text.length);
    const prompt = `
        Extract and organize the following PDF content into the following sections:

        - name
        - email
        - phone_number
        - skills as a STRING ARRAY, must be a string array
        
        Content: ${text}
        
        Respond with a JSON object containing these sections and ONLY these sections, even if some sections are empty or not present, name CANNOT be null.
        ONLY if name cannot be found, its the first 2 or 3 words.
    `;
    

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error in parsePdfContentToSections:', error.response ? error.response.data : error.message);
    throw new Error('Failed to parse PDF content into sections');
  }
}

module.exports = { parsePdfContentToSections };
