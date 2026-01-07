import React from 'react';
import { formatToday } from '../utils/helpers';

function DailyAnalysisScreen({ cycleData, analysisResult, onBack }) {
  return (
    <div className="daily-screen analysis-mode">
      <div className="daily-top-area">
        <button className="top-pill-button">일간리포트</button>
        <div className="analysis-date-header">{formatToday()}</div>
      </div>
      <div className="message-banner">
        <p>오늘은 힘든 하루였군요 수고하셨습니다</p>
        <p>오늘의 기록을 같이 살펴봅시다</p>
      </div>
      <div className="analysis-card">
        <div className="phase-badge-floating">
          {cycleData.dDay >= 12 && cycleData.dDay <= 16 ? '배란기' : '황체기'}
          {cycleData.dDay > 0 && ` (월경 ${cycleData.dDay}일 전)`}
        </div>
        <div className="summary-box">{analysisResult.summary}</div>
        <div className="advice-box">
          <div className="advice-title">한 마디</div>
          <div className="advice-content">{analysisResult.advice}</div>
        </div>
      </div>
      <div className="submit-area">
        <button className="submit-button active" onClick={onBack}>돌아가기</button>
      </div>
    </div>
  );
}
export default DailyAnalysisScreen;