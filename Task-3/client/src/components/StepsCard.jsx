import React from 'react';

const StepsCard = ({ steps }) => (
  <div className="card">
    <h3 className="text-steps">Actionable Steps</h3>
    <ul className="steps-list">
      {steps.map((step, idx) => (
        <li key={idx} className="step-item">
          <span className="step-number">{idx + 1}.</span>
          <span>{step}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default StepsCard;