const extractionService = require('../services/extractionService');

const analyzeText = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text input is required' });
        }

        const result = await extractionService.extractKnowledge(text);
        res.status(200).json(result);

    } catch (error) {
        console.error('Extraction Error:', error.message);
        res.status(500).json({ error: 'Failed to extract knowledge from the content.' });
    }
};

module.exports = { analyzeText };