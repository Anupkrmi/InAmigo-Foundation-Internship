import React from 'react';

const SummaryCard = ({ summary }) => (
  <div className="card">
    <h3 className="text-summary">Executive Summary</h3>
    <p>{summary}</p>
  </div>
);

export default SummaryCard;