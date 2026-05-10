import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import SummaryCard from '../components/SummaryCard';
import StepsCard from '../components/StepsCard';
import ConceptsCard from '../components/ConceptsCard';
import ExplanationCard from '../components/ExplanationCard';
import { analyzeText } from '../services/api';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  const handleExtraction = async (text) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeText(text);
      setExtractedData(data);
    } catch (err) {
      setError("Failed to extract knowledge. Ensure your backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-container">
      <div className="hero">
        <h1>Reel Knowledge Extractor</h1>
        <p>Paste educational reel captions below to generate structured insights.</p>
      </div>

      <InputBox onSubmit={handleExtraction} isLoading={isLoading} />
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {extractedData && !isLoading && (
        <div>
          <h2 className="results-header">Extraction Results</h2>
          <div className="results-grid">
            <SummaryCard summary={extractedData.summary} />
            <ConceptsCard concepts={extractedData.key_concepts} />
            <StepsCard steps={extractedData.steps} />
            <ExplanationCard explanation={extractedData.explanation} />
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;