import { useState } from 'react';
import { questions } from './questions';
import ProgressBar from './components/ProgressBar';
import Question from './components/Question';
import Results from './components/Results';
import './App.css';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (score) => {
    setAnswers([...answers, score]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const totalScore = answers.reduce((acc, score) => acc + score, 0);

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title text-center">Test your depression</h1>
          <p className="card-text">
            This questionnaire consists of 21 groups of statements. Read each group carefully and choose one statement from each group that best describes the way you have been feeling during the past two weeks, including today.
          </p>
          <p className="card-text">
            If several statements in a group apply equally, circle the highest number.
          </p>
          <hr />
          {!showResults ? (
            <div>
              <ProgressBar current={currentQuestion} total={questions.length} />
              <Question
                question={questions[currentQuestion]}
                onAnswer={handleAnswer}
              />
            </div>
          ) : (
            <Results score={totalScore} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
