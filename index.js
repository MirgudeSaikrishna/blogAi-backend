const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {GoogleGenerativeAI}= require("@google/generative-ai")
// const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const genAI = new GoogleGenerativeAI(OPENAI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40
    }
});

app.get('/generate-content', async (req, res) => {
    const topic  = req.query.topic;
    if (!topic) {
        return res.status(400).send('Topic is required');
    }
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const updatedtopic="Write me a blog post about "+topic+" , and donot use unwanted symbols like ` and *";
    try {
        const result = await model.generateContentStream(updatedtopic);
        for await (const chunk of result.stream) {
            let text = chunk.text();
            if(text){
                res.write(`data: ${text}\n\n`);
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).send('Error generating content');
    }
});

app.listen(5000, () => {
    console.log(`Server running on port 5000`);
});
