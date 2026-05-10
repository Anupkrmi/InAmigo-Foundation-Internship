const aiService = require('./aiService');
const { getExtractionSystemPrompt } = require('../utils/promptTemplate');

const extractKnowledge = async (text) => {
    const systemInstruction = getExtractionSystemPrompt();
    const extractedData = await aiService.generateAIResponse(text, systemInstruction);
    return extractedData;
};

module.exports = { extractKnowledge };