import React from 'react';

const ExplanationCard = ({ explanation }) => (
  <div className="card explanation-card">
    <h3 className="text-explanation">Deep Explanation</h3>
    <p>{explanation}</p>
  </div>
);

export default ExplanationCard;