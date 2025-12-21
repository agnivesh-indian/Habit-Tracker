import React from 'react';

const Results = ({ score }) => {
  const getDepressionLevel = (score) => {
    if (score >= 0 && score <= 13) {
      return 'Minimal';
    } else if (score >= 14 && score <= 19) {
      return 'Mild';
    } else if (score >= 20 && score <= 28) {
      return 'Moderate';
    } else if (score >= 29 && score <= 63) {
      return 'Severe';
    }
  };

  const depressionLevel = getDepressionLevel(score);

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Results</h2>
        <p className="card-text">Your score: {score}</p>
        <p className="card-text">Depression level: {depressionLevel}</p>
        <div className="alert alert-warning" role="alert">
          <strong>Disclaimer:</strong> This self-assessment is not a substitute for a professional diagnosis. The results of this test are for informational purposes only and should not be considered a diagnosis. It is highly recommended to consult a qualified mental health professional for an accurate diagnosis and treatment plan.
        </div>
      </div>
    </div>
  );
};

export default Results;
