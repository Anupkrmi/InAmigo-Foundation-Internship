import React from 'react';

const ConceptsCard = ({ concepts }) => (
  <div className="card">
    <h3 className="text-concepts">Key Concepts</h3>
    <div className="concepts-container">
      {concepts.map((concept, idx) => (
        <span key={idx} className="concept-tag">
          {concept}
        </span>
      ))}
    </div>
  </div>
);

export default ConceptsCard;