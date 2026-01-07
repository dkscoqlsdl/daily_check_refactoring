import React from 'react';
import { getMonthlyStats, generateMonthlyReport } from '../utils/helpers';

function MonthlyReportScreen({ allData, onNavigate }) {
  
  const stats = getMonthlyStats(allData);
  const report = generateMonthlyReport(stats);
  const todayForMonthly = new Date();
  
  const polylinePoints = `15,${100 - (stats[1].fatigueHigh/7)*100} 40,${100 - (stats[2].fatigueHigh/7)*100} 65,${100 - (stats[3].fatigueHigh/7)*100} 90,${100 - (stats[4].fatigueHigh/7)*100}`;

  return (
    <div className="monthly-screen">
      <div className="daily-top-area">
        <h2 className="logo-small">HAWD</h2>
        <p className="sub-small">Have a wonderful day diet</p>
        <div className="tab-container">
          <button className="tab-button" onClick={() => onNavigate('daily')}>일간리포트</button>
          <button className="tab-button" onClick={() => onNavigate('calendar')}>캘린더</button>
          <button className="tab-button active">월간리포트</button>
        </div>
      </div>
      <div className="monthly-content-scroll">
        <div className="chart-card">
          <h3 className="chart-title">{todayForMonthly.getMonth() + 1}월의 식생활 기록</h3>
          <div className="chart-area">
            <div className="chart-y-axis"><span>7</span><span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div>
            <div className="bars-container">
              {[1, 2, 3, 4].map(week => (
                <div key={week} className="bar-group">
                  <div className="bar blue" style={{height: `${(stats[week].fasting / 7) * 100}%`}}></div>
                  <div className="bar orange" style={{height: `${(stats[week].snack / 7) * 100}%`}}></div>
                  <div className="bar grey" style={{height: `${(stats[week].proper / 7) * 100}%`}}></div>
                  <div className="bar yellow" style={{height: `${(stats[week].binge / 7) * 100}%`}}></div>
                  <span className="x-label">{week}주</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="dot blue"></span>절식</span>
            <span className="legend-item"><span className="dot orange"></span>군것질</span>
            <span className="legend-item"><span className="dot grey"></span>적정</span>
            <span className="legend-item"><span className="dot yellow"></span>폭식</span>
          </div>
          <button className="view-report-btn">주기별 리포트 보기</button>
        </div>

        <div className="text-analysis-card">
          {[1, 2, 3, 4].map(week => (
            <div key={week} className="analysis-item">
              <h4>{week}주차 — {report.weeklyTexts[week].title}</h4>
              <p>{report.weeklyTexts[week].desc}</p>
            </div>
          ))}
        </div>

        <div className="chart-card">
          <div className="chart-area combo-chart">
            <div className="chart-y-axis"><span>7</span><span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div>
            <div className="bars-container relative">
              <svg className="line-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline points={polylinePoints} fill="none" stroke="#999" strokeWidth="2" />
              </svg>
              {[1, 2, 3, 4].map(week => (
                <div key={week} className="bar-group">
                  <div className="bar blue" style={{height: `${(stats[week].stressHigh / 7) * 100}%`}}></div>
                  <div className="bar orange" style={{height: `${(stats[week].binge / 7) * 100}%`}}></div>
                  <span className="x-label">{week}주</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="dot blue"></span>스트레스 4↑</span>
            <span className="legend-item"><span className="dot orange"></span>폭식</span>
            <span className="legend-item"><span className="line-legend"></span>피로도 4↑</span>
          </div>
          <div className="analysis-box-bottom">
            <h4>🌙 {todayForMonthly.getMonth() + 1}월 월간 패턴 분석</h4>
            <h5 style={{marginTop:'15px', fontSize:'1rem'}}>전체적인 흐름</h5>
            <p>파란 막대(스트레스)가 높을 때 꺾은선(피로도)도 같이 올라가는지 확인해보세요. 두 가지가 겹칠 때 폭식(주황 막대)이 발생하는지 관찰하는 것이 핵심입니다.</p>
          </div>
        </div>

        <div className="text-analysis-card last">
          <div className="analysis-item">
            <h4>나는 어떤 유형일까?</h4>
            <p><strong>{report.userType.title}</strong></p>
            {report.userType.desc.map((d, i) => <p key={i}>- {d}</p>)}
          </div>
          <hr className="divider"/>
          <div className="analysis-item">
            <h4>월간 유형 맞춤 코멘트</h4>
            {report.comments.map((c, i) => <p key={i}>- {c}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}
export default MonthlyReportScreen;