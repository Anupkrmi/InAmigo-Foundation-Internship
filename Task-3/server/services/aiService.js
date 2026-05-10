const axios = require('axios');

const generateAIResponse = async (prompt, systemInstruction) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing in .env file");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    summary: { type: "STRING", description: "A concise 2-3 sentence summary of the reel." },
                    steps: { type: "ARRAY", items: { type: "STRING" }, description: "Actionable, step-by-step breakdown." },
                    key_concepts: { type: "ARRAY", items: { type: "STRING" }, description: "Core keywords or concepts discussed." },
                    explanation: { type: "STRING", description: "A clear, deeper explanation of the topic." }
                },
                required: ["summary", "steps", "key_concepts", "explanation"]
            }
        }
    };

    const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
    });

    const jsonString = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(jsonString); // Parse the guaranteed JSON structure
};

module.exports = { generateAIResponse };
