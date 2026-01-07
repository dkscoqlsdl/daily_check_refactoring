import React from 'react';

function ResultScreen({ resultData, onNext }) {
  return (
    <div className="result-screen">
      <div className="result-box">
        <div className="score-label-container"><div className="score-label">총점 수준</div></div>
        <div className="score-display">[ {resultData.score} ]</div>
        <div className="level-text">{resultData.level}</div>
        <div className="message-box">{resultData.message}</div>
        <button className="next-button" onClick={onNext}>Next &gt;</button>
      </div>
    </div>
  );
}
export default ResultScreen;