import React from 'react';

const Question = ({ question, onAnswer }) => {
  return (
    <div>
      <h2>{question.question}</h2>
      <div className="list-group">
        {question.options.map((option, index) => (
          <button
            key={index}
            type="button"
            className="list-group-item list-group-item-action"
            onClick={() => onAnswer(option.score)}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
