import React from 'react';
import { questions } from '../utils/helpers';

function SurveyScreen({ answers, onSelect, onSubmit, isAllAnswered }) {
  return (
    <div className="survey-screen">
      <div className="survey-header"><p>HAWD에 온 당신을 환영합니다!</p></div>
      <div className="questions-total">
        {questions.map((q) => (
          <div key={q.id} className="question-box">
            <div className="question-title">{q.title}</div>
            <div className="options-container">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div 
                  key={index} 
                  onClick={() => onSelect(q.id, index)} 
                  className={`circle-option ${answers[q.id] === index ? 'selected' : ''}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="submit-area">
        <button onClick={onSubmit} className={`submit-button ${isAllAnswered ? 'active' : ''}`} disabled={!isAllAnswered}>Done</button>
      </div>
    </div>
  );
}
export default SurveyScreen;