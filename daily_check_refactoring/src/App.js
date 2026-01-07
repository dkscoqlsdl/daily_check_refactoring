import React, { useState } from 'react';
import './App.css';

// 1. 컴포넌트 불러오기
import MainScreen from './components/MainScreen';
import SurveyScreen from './components/SurveyScreen';
import ResultScreen from './components/ResultScreen';
import CalendarScreen from './components/CalendarScreen';
import DailyReportScreen from './components/DailyReportScreen';
import DailyAnalysisScreen from './components/DailyAnalysisScreen';
import MonthlyReportScreen from './components/MonthlyReportScreen';
import RecordModal from './components/RecordModal';

// 2. 유틸리티 함수 불러오기
import { 
  getDummyData, 
  getDateKey, 
  getDateStringFromDate, 
  getGeneralScaleText, 
  getStressText, 
  analyzeCondition 
} from './utils/helpers';

function App() {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [answers, setAnswers] = useState({});
  const [resultData, setResultData] = useState(null);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [cycleData, setCycleData] = useState({
    dDay: 0, nextDate: null, avgCycle: 28, isPeriodToday: false
  });

  const [showModal, setShowModal] = useState(false); 
  const [modalStep, setModalStep] = useState('menu'); 
  const [dailyRecords, setDailyRecords] = useState([]); 
  const [tempInput, setTempInput] = useState(''); 
  const [tempSelection, setTempSelection] = useState(null);
  const [recordDate, setRecordDate] = useState(new Date());
  const [allData, setAllData] = useState(getDummyData());
  const [viewDate, setViewDate] = useState(null); 
  const [viewData, setViewData] = useState(null); 
  const [analysisResult, setAnalysisResult] = useState({ summary: '', advice: '' });
  const [conditionData, setConditionData] = useState({ fatigue: 0, stress: 0, diet: '', mood: 0 });

  // --- 핸들러 함수들 ---
  const handleStart = () => setCurrentScreen('survey');
  const handleSelect = (questionId, value) => setAnswers({ ...answers, [questionId]: value });
  
  const handleSubmit = () => {
      // (점수 계산 로직은 간단해서 여기에 둬도 되고, utils로 빼도 됨)
      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
      const averageScore = (totalScore / 8).toFixed(1); // 문항수 8개
      let level = '', message = '';
      const score = parseFloat(averageScore);
      if (score <= 1.0) { level = '매우 낮음'; message = '식이에 관련된 병리적 행동이나 생각이 거의 없습니다.'; }
      else if (score <= 2.2){ level = '약간 높음'; message = '몸매나 체중에 집착하는 경형과 다이어트적 사고를 할 수 있습니다.'; }
      else if (score <= 2.7){ level = '임상적 관심 필요'; message = '일반인 평균보다 유의하게 높습니다.'; }
      else if (score <= 3.0){ level = '임상군 평균 수준'; message = '전문적인 평가와 상담이 필요합니다.'; }
      else { level = '매우 심각'; message = '즉시 전문가의 도움을 받는 것이 강력히 권장됩니다.'; }
      setResultData({ score: averageScore, level, message });
      setCurrentScreen('result');
  };

  // 캘린더 관련
  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  const handleDateClick = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateKey = getDateKey(year, month, day);
    if (cycleData.nextDate === null) {
        if (selectedDates.includes(dateKey)) setSelectedDates(selectedDates.filter(d => d !== dateKey));
        else setSelectedDates([...selectedDates, dateKey]);
    } else if (allData[dateKey]) {
        const dateObj = new Date(year, month, day);
        const dayName = ['일','월','화','수','목','금','토'][dateObj.getDay()];
        setViewDate(`${month + 1}월 ${day}일 (${dayName})`);
        setViewData(allData[dateKey]);
        setModalStep('view_detail');
        setShowModal(true);
    } 
  };

  const handleCalendarComplete = () => {
    if (selectedDates.length === 0) { alert("날짜를 최소 하루 이상 선택해주세요."); return; }
    const sortedDates = [...selectedDates].sort((a, b) => new Date(a) - new Date(b));
    setSelectedDates(sortedDates);
    // (간단 주기에측 로직 - 필요시 utils로 이동 가능)
    const startDates = [new Date(sortedDates[0])];
    for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        if (Math.ceil(Math.abs(curr - prev) / (1000 * 60 * 60 * 24)) > 2) startDates.push(curr);
    }
    let totalCycleDays = 0, cycleCount = 0;
    if (startDates.length >= 2) {
        for (let i = 1; i < startDates.length; i++) {
            totalCycleDays += (startDates[i] - startDates[i-1]) / (1000 * 60 * 60 * 24);
            cycleCount++;
        }
    }
    const averageCycle = cycleCount > 0 ? Math.round(totalCycleDays / cycleCount) : 28; 
    const lastStartDate = startDates[startDates.length - 1];
    const nextPeriodDate = new Date(lastStartDate);
    nextPeriodDate.setDate(lastStartDate.getDate() + averageCycle);
    const today = new Date();
    today.setHours(0,0,0,0); nextPeriodDate.setHours(0,0,0,0);
    const dDay = Math.ceil((nextPeriodDate - today) / (1000 * 60 * 60 * 24));
    setCycleData({ avgCycle: averageCycle, nextDate: nextPeriodDate, dDay: dDay });
    setCurrentScreen('daily');
  };

  // 기록 관련
  const handlePrevDay = () => { const newDate = new Date(recordDate); newDate.setDate(recordDate.getDate() - 1); setRecordDate(newDate); };
  const handleNextDay = () => { const newDate = new Date(recordDate); newDate.setDate(recordDate.getDate() + 1); setRecordDate(newDate); };
  
  const openAddModal = () => { setModalStep('menu'); setTempInput(''); setTempSelection(null); setConditionData({ fatigue: 0, stress: 0, diet: '', mood: 0 }); setShowModal(true); };
  const closeAddModal = () => { setShowModal(false); };
  
  const handleAddRecord = (type, value, label) => { 
      const dateKey = getDateStringFromDate(recordDate); 
      const newRecord = { id: Date.now(), type, value, label, dateKey }; 
      setDailyRecords([...dailyRecords, newRecord]); 
      closeAddModal(); 
  };
  
  const handleWeightSubmit = () => { if (!tempInput) return; handleAddRecord('weight', `${tempInput}kg`, '체중'); };
  const handleSleepSubmit = () => { if (!tempSelection) { alert("수면 상태를 선택해주세요."); return; } const valueText = getGeneralScaleText(tempSelection); handleAddRecord('sleep', valueText, '수면'); };
  const handleStressSingleSubmit = () => { if (!tempSelection) { alert("스트레스 정도를 선택해주세요."); return; } const valueText = getStressText(tempSelection); handleAddRecord('stress', valueText, '스트레스'); };

  const handleConditionSubmit = () => {
    if (conditionData.fatigue === 0 || conditionData.stress === 0 || conditionData.diet === '' || conditionData.mood === 0) { alert("모든 상태를 체크해주세요!"); return; }
    setModalStep('condition_success');
    setTimeout(() => {
        const dateKey = getDateStringFromDate(recordDate);
        setAllData(prev => ({ ...prev, [dateKey]: { ...conditionData, timestamp: Date.now() } }));
        const result = analyzeCondition(conditionData);
        setAnalysisResult(result);
        setDailyRecords(prev => [...prev, { id: Date.now(), type: 'condition', value: '기록 완료', label: '오늘의 상태', dateKey: dateKey }]);
        setShowModal(false);
        setCurrentScreen('daily_analysis');
    }, 2000);
  };

  const toggleSupplement = () => {
    const dateKey = getDateStringFromDate(recordDate);
    const exists = dailyRecords.some(r => r.dateKey === dateKey && r.type === 'supplement');
    if (exists) setDailyRecords(dailyRecords.filter(r => !(r.dateKey === dateKey && r.type === 'supplement')));
    else { const newRecord = { id: Date.now(), type: 'supplement', value: '영양제 먹기', label: '영양제', dateKey }; setDailyRecords([...dailyRecords, newRecord]); }
  };

  return (
    <div className="app-container">
      {currentScreen === 'main' && <MainScreen onStart={handleStart} />}
      
      {currentScreen === 'survey' && (
        <SurveyScreen 
          answers={answers} 
          onSelect={handleSelect} 
          onSubmit={handleSubmit} 
          isAllAnswered={Object.keys(answers).length === 8} // 문항수 하드코딩 대신 Object keys check
        />
      )}
      
      {currentScreen === 'result' && resultData && (
        <ResultScreen resultData={resultData} onNext={() => setCurrentScreen('calendar')} />
      )}
      
      {currentScreen === 'calendar' && (
        <CalendarScreen 
          currentDate={currentDate}
          selectedDates={selectedDates}
          allData={allData}
          cycleData={cycleData}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDateClick={handleDateClick}
          onComplete={handleCalendarComplete}
          onBack={() => setCurrentScreen('daily')}
        />
      )}
      
      {currentScreen === 'daily' && (
        <DailyReportScreen 
          cycleData={cycleData}
          dailyRecords={dailyRecords}
          recordDate={recordDate}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onToggleSupplement={toggleSupplement}
          onAddRecord={openAddModal}
          onNavigate={setCurrentScreen}
        />
      )}
      
      {currentScreen === 'daily_analysis' && (
        <DailyAnalysisScreen 
          cycleData={cycleData}
          analysisResult={analysisResult}
          onBack={() => setCurrentScreen('daily')}
        />
      )}
      
      {currentScreen === 'monthly' && (
        <MonthlyReportScreen 
          allData={allData} 
          onNavigate={setCurrentScreen} 
        />
      )}

      <RecordModal 
        showModal={showModal}
        onClose={closeAddModal}
        modalStep={modalStep}
        setModalStep={setModalStep}
        tempInput={tempInput}
        setTempInput={setTempInput}
        tempSelection={tempSelection}
        setTempSelection={setTempSelection}
        conditionData={conditionData}
        setConditionData={setConditionData}
        handleWeightSubmit={handleWeightSubmit}
        handleAddRecord={handleAddRecord}
        handleSleepSubmit={handleSleepSubmit}
        handleStressSingleSubmit={handleStressSingleSubmit}
        handleConditionSubmit={handleConditionSubmit}
        viewData={viewData}
        viewDate={viewDate}
      />
    </div>
  );
}

export default App;