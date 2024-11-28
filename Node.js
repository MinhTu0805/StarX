const axios = require('axios');

const API_KEY = 'sk-proj-qn0IjND8cmEMuGhkr-VaZPm0egoH-YfvyZVGkBco53sN18Z1c95hUrT0WnOztxe--58tzF36GtT3BlbkFJ6dbteQCyJuNnUIqurAezzVNAOvQQo2sy2Yr_hLK_2NeMK6FEutaMFfnKx6xgL2rGSiyuiHoAE';

async function generateResponse(prompt) {
    const url = 'https://api.openai.com/v1/completions';
    const data = {
        model: 'gpt-4',
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7,
    };
    
    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(url, data, { headers: headers });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return 'Sorry, I could not process your request at this time.';
    }
}

// Create an endpoint that Roblox can call
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    const response = await generateResponse(prompt);
    res.json({ response });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
