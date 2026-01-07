import React from 'react';
import { getDateKey } from '../utils/helpers';

function CalendarScreen({ 
  currentDate, 
  selectedDates, 
  allData, 
  cycleData,
  onPrevMonth, 
  onNextMonth, 
  onDateClick, 
  onComplete,
  onBack,
  // showModal,
  // modalContent // 모달은 App.js에서 띄우지만 내용은 여기서 전달받음
}) {
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    let ovulationStart = null;
    let ovulationEnd = null;
    if (cycleData.nextDate) {
        const ovulDate = new Date(cycleData.nextDate);
        ovulDate.setDate(ovulDate.getDate() - 14);
        ovulationStart = new Date(ovulDate); ovulationStart.setDate(ovulationStart.getDate() - 2);
        ovulationEnd = new Date(ovulDate); ovulationEnd.setDate(ovulationEnd.getDate() + 2);
    }

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = getDateKey(year, month, day);
        const isSelected = selectedDates.includes(dateKey);
        const hasData = allData[dateKey] !== undefined;
        const currentDayObj = new Date(year, month, day);
        currentDayObj.setHours(0,0,0,0);

        let isOvulation = false;
        if (ovulationStart && ovulationEnd) {
            const s = new Date(ovulationStart); s.setHours(0,0,0,0);
            const e = new Date(ovulationEnd); e.setHours(0,0,0,0);
            if (currentDayObj >= s && currentDayObj <= e) isOvulation = true;
        }

        const showDataDot = (cycleData.nextDate !== null) && hasData && !isSelected;

        days.push(
          <div key={day} className={`calendar-day ${isSelected ? 'selected' : ''}`} onClick={() => onDateClick(day)}>
            <span className="day-number">{day}</span>
            {isSelected && <div className="menstruation-mark">월경</div>}
            {!isSelected && isOvulation && <div className="ovulation-mark">배란기</div>}
            {showDataDot && <div className="data-dot"></div>}
          </div>
        );
    }
    return days;
  };

  return (
    <div className="calendar-screen">
      <div className="calendar-instruction">
        {cycleData.nextDate ? "기록된 날짜를 클릭하여 상세 정보를 확인하세요" : "월경주기 확인을 위해 최근 3번의 월경날짜를 기록해주세요"}
      </div>
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={onPrevMonth}>◀</button>
          <span className="month-display">{currentDate.getMonth() + 1}월</span>
          <button onClick={onNextMonth}>▶</button>
        </div>
        <div className="calendar-grid">
          {['일', '월', '화', '수', '목', '금', '토'].map(day => (<div key={day} className="calendar-weekday">{day}</div>))}
          {renderCalendarDays()}
        </div>
      </div>
      <div className="submit-area">
        {cycleData.nextDate === null ? (
          <button className="submit-button active" onClick={onComplete}>Save Dates</button>
        ) : (
          <button className="submit-button active" onClick={onBack}>돌아가기</button>
        )}
      </div>
    </div>
  );
}
export default CalendarScreen;