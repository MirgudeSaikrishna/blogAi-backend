// backend/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const {GoogleGenerativeAI}= require("@google/generative-ai")
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const genAI = new GoogleGenerativeAI(OPENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
app.post('/generate-content', async (req, res) => {
    const { topic } = req.body;
    const updatedtopic="Write me a blog post about "+topic+",donot use unwanted symbols like ` and *";
    if (!topic) {
        return res.status(400).send('Topic is required');
    }
    try {
        const result = await model.generateContent(updatedtopic);
        const generatedContent = result.response.text();
        res.json({ content: generatedContent });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).send('Error generating content');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
