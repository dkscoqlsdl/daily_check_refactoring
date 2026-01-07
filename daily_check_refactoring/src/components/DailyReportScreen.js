import React from 'react';
import { formatToday, formatRecordDate, getDateStringFromDate, getRecordIcon } from '../utils/helpers';

function DailyReportScreen({ 
  cycleData, 
  dailyRecords, 
  recordDate, 
  onPrevDay, 
  onNextDay, 
  onToggleSupplement, 
  onAddRecord, 
  onNavigate 
}) {
  
  return (
    <div className="daily-screen">
      <div className="daily-top-area">
        <h2 className="logo-small">HAWD</h2>
        <p className="sub-small">Have a wonderful day diet</p>
        <div className="tab-container">
          <button className="tab-button active">일간리포트</button>
          <button className="tab-button" onClick={() => onNavigate('calendar')}>캘린더</button>
          <button className="tab-button" onClick={() => onNavigate('monthly')}>월간리포트</button>
        </div>
        <div className="status-card">
          <div className="today-date-small">{formatToday()}</div>
          <div className="d-day-text">
            {cycleData.dDay > 0 ? (<>월경 <span className="highlight-text">{cycleData.dDay}일 전</span></>) : cycleData.dDay === 0 ? (<span className="highlight-text">오늘이 월경 예정일입니다</span>) : (<>월경 <span className="highlight-text">{Math.abs(cycleData.dDay)}일 지남</span></>)}
          </div>
          <div className="phase-badge">{cycleData.dDay >= 12 && cycleData.dDay <= 16 ? '배란기' : '황체기'}</div>
        </div>
      </div>
      <div className="record-container">
        <div className="record-header"><h3>기록</h3></div>
        <div className="date-navigator">
          <button onClick={onPrevDay}>&lt;</button>
          <span>{formatRecordDate(recordDate)}</span>
          <button onClick={onNextDay}>&gt;</button>
        </div>
        <div className="record-list-scroll">
          <div className="check-item-box">
            <div className="check-label">영양제</div>
            <div className="check-row">
              <div className="icon-pill">💊</div><span>영양제 먹기</span>
              <button 
                className={`check-box ${dailyRecords.some(r => r.dateKey === getDateStringFromDate(recordDate) && r.type === 'supplement') ? 'checked' : ''}`} 
                onClick={onToggleSupplement}
              >
                ✔
              </button>
            </div>
          </div>
          {dailyRecords
            .filter(record => record.dateKey === getDateStringFromDate(recordDate) && record.type !== 'supplement')
            .map((record) => (
            <div key={record.id} className="check-item-box">
              <div className="check-label">{record.label}</div>
              <div className="check-row">
                <div className="icon-pill">{getRecordIcon(record.type)}</div><span>{record.value}</span>
                <button className="check-box checked">✔</button>
              </div>
            </div>
          ))}
          <div className="check-item-box">
            <div className="check-label">건강 및 일상</div>
            <div className="check-row add-row" onClick={onAddRecord}>
              <div className="icon-plus">⊕</div><span>기록 추가하기</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DailyReportScreen;