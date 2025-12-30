import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [answers, setAnswers] = useState({});
  const [resultData, setResultData] = useState(null);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [cycleData, setCycleData] = useState({
    dDay: 0,
    nextDate: null,
    avgCycle: 28,
    isPeriodToday: false
  });

  const [showModal, setShowModal] = useState(false); 
  const [modalStep, setModalStep] = useState('menu'); 
  const [dailyRecords, setDailyRecords] = useState([]); 
  const [tempInput, setTempInput] = useState(''); 
  const [tempSelection, setTempSelection] = useState(null);
  const [recordDate, setRecordDate] = useState(new Date());

  const [conditionData, setConditionData] = useState({
    fatigue: 0, stress: 0, diet: '', mood: 0     
  });

  // 더미 데이터
  const getDummyData = () => {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      
      return {
          [`${y}-${m}-01`]: { fatigue: 2, stress: 1, diet: '적당함 섭취', mood: 4, timestamp: Date.now() },
          [`${y}-${m}-02`]: { fatigue: 1, stress: 2, diet: '적당함 섭취', mood: 3, timestamp: Date.now() },
          [`${y}-${m}-03`]: { fatigue: 3, stress: 2, diet: '군것질', mood: 3, timestamp: Date.now() },
          [`${y}-${m}-05`]: { fatigue: 2, stress: 1, diet: '폭식', mood: 2, timestamp: Date.now() }, 
          [`${y}-${m}-08`]: { fatigue: 4, stress: 4, diet: '끼니 거름', mood: 2, timestamp: Date.now() },
          [`${y}-${m}-09`]: { fatigue: 3, stress: 3, diet: '군것질', mood: 3, timestamp: Date.now() },
          [`${y}-${m}-12`]: { fatigue: 5, stress: 5, diet: '폭식', mood: 1, timestamp: Date.now() },
          [`${y}-${m}-15`]: { fatigue: 5, stress: 4, diet: '폭식', mood: 1, timestamp: Date.now() },
          [`${y}-${m}-16`]: { fatigue: 4, stress: 5, diet: '군것질', mood: 2, timestamp: Date.now() },
          [`${y}-${m}-18`]: { fatigue: 3, stress: 3, diet: '적당함 섭취', mood: 3, timestamp: Date.now() }
      };
  };

  const [allData, setAllData] = useState(getDummyData());
  const [viewDate, setViewDate] = useState(null); 
  const [viewData, setViewData] = useState(null); 
  const [analysisResult, setAnalysisResult] = useState({ summary: '', advice: '' });

  const [questions] = useState([
    { id: 1, title: '1. 지난 28일 동안, 체중이나 체형에 영향을 주기 위해 일부러 먹는 양을 줄이거나 식사를 제한하려고 노력한 정도는 어느 정도인가?' },
    { id: 2, title: '2. 음식을 먹을 때, 먹는 행동을 스스로 조절하지 못한다고 느낀 순간이 얼마나 자주 있었는가?' },
    { id: 3, title: '3. 짧은 시간 안에 평소보다 훨씬 많은 양의 음식을 먹은 적이 얼마나 있었는가?' },
    { id: 4, title: '4. 체중 증가를 막기 위해 구토, 금식, 약물(이뇨제, 하제), 또는 지나친 운동과 같은 보상행동을 한 빈도는 어느 정도인가?' },
    { id: 5, title: '5. 지난 28일 동안 체형이나 체중에 대해 걱정하거나 불안해 한 빈도는 어느 정도인가?' },
    { id: 6, title: '6. 자신의 제형에 대해, 다른 사람들보다 더 뚱뚱하다고 느낀 정도는 어느 정도인가?' },
    { id: 7, title: '7. 체중 또는 체형이 자신의 가치감이나 자존감을 결정하는 데 큰 역할을 했는가?' },
    { id: 8, title: '8. 지난 28일간 몸무게를 재거나, 거울 혹은 신체 부분을 반복적으로 확인한 빈도는 어느 정도인가?' },
  ]);
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  const getDateKey = (year, month, day) => {
    const strMonth = String(month + 1).padStart(2, '0');
    const strDay = String(day).padStart(2, '0');
    return `${year}-${strMonth}-${strDay}`;
  };

  const getDateStringFromDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handlePrevDay = () => { const newDate = new Date(recordDate); newDate.setDate(recordDate.getDate() - 1); setRecordDate(newDate); };
  const handleNextDay = () => { const newDate = new Date(recordDate); newDate.setDate(recordDate.getDate() + 1); setRecordDate(newDate); };

  const formatRecordDate = (date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      return `${month}월 ${day}일 (${dayName})${isToday ? ', 오늘' : ''}`;
  }

  const formatToday = () => {
      const today = new Date();
      return `${today.getMonth() + 1}월 ${today.getDate()}일 (${['일', '월', '화', '수', '목', '금', '토'][today.getDay()]})`;
  }

  const getStressText = (level) => level <= 1 ? "매우 낮음" : level === 2 ? "낮음" : level === 3 ? "보통" : level === 4 ? "높음" : "매우 높음";
  const getFatigueText = (level) => level <= 1 ? "매우 좋음" : level === 2 ? "좋음" : level === 3 ? "보통" : level === 4 ? "피곤함" : "매우 피곤함";
  const getGeneralScaleText = (level) => { if (level === 1) return "매우 나쁨"; if (level === 2) return "나쁨"; if (level === 3) return "보통"; if (level === 4) return "좋음"; if (level === 5) return "매우 좋음"; return ""; };
  const getRecordIcon = (type) => { switch(type) { case 'weight': return '⚖️'; case 'sleep': return '💤'; case 'stress': return '⚡'; case 'condition': return '💗'; case 'supplement': return '💊'; default: return '📝'; } };

  const handleStart = () => { setCurrentScreen('survey'); };
  const handleSelect = (questionId, value) => { setAnswers({ ...answers, [questionId]: value }); };

  const handleSubmit = () => {
      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
      const averageScore = (totalScore / questions.length).toFixed(1);
      let level = '', message = '';
      const score = parseFloat(averageScore);
      if (score <= 1.0) { level = '매우 낮음'; message = '식이에 관련된 병리적 행동이나 생각이 거의 없습니다. 현재 건강한 식습관을 유지하고 계십니다.'; }
      else if (score <= 2.2){ level = '약간 높음'; message = '몸매나 체중에 집착하는 경형과 다이어트적 사고를 할 수 있습니다. 건강한 식습관을 유지하기 위해 노력하세요.'; }
      else if (score <= 2.7){ level = '임상적 관심 필요'; message = '일반인 평균보다 유의하게 높습니다. 식이에 관련된 병리적 행동이나 생각이 있을 수 있으니 상담을 권장합니다.'; }
      else if (score <= 3.0){ level = '임상군 평균 수준'; message = '실제 치료 대상자 평균 범위와 유사합니다. 식이에 관련된 병리적 행동이나 생각이 있을 가능성이 높으니 전문적인 평가와 상담이 필요합니다.'; }
      else { level = '매우 심각'; message = '병리적 수준의 체중과 체형 집착 및 다이어트적 사고가 매우 심각합니다. 즉시 전문가의 도움을 받는 것이 강력히 권장됩니다.'; }
      setResultData({ score: averageScore, level, message });
      setCurrentScreen('result');
  };

  const handleGoToCalendar = () => { setCurrentScreen('calendar'); };

  const handleDateClick = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateKey = getDateKey(year, month, day);
    if (cycleData.nextDate === null) {
        if (selectedDates.includes(dateKey)) setSelectedDates(selectedDates.filter(d => d !== dateKey));
        else setSelectedDates([...selectedDates, dateKey]);
        return; 
    }
    if (allData[dateKey]) {
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

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];
    let ovulationStart = null; let ovulationEnd = null;
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
        days.push(<div key={day} className={`calendar-day ${isSelected ? 'selected' : ''}`} onClick={() => handleDateClick(day)}><span className="day-number">{day}</span>{isSelected && <div className="menstruation-mark">월경</div>}{!isSelected && isOvulation && <div className="ovulation-mark">배란기</div>}{showDataDot && <div className="data-dot"></div>}</div>);
    }
    return days;
  };
  const isAllAnswered = questions.every(q => answers[q.id] !== undefined);

  const openAddModal = () => { setModalStep('menu'); setTempInput(''); setTempSelection(null); setConditionData({ fatigue: 0, stress: 0, diet: '', mood: 0 }); setShowModal(true); };
  const closeAddModal = () => { setShowModal(false); };
  const handleAddRecord = (type, value, label) => { const dateKey = getDateStringFromDate(recordDate); const newRecord = { id: Date.now(), type, value, label, dateKey }; setDailyRecords([...dailyRecords, newRecord]); closeAddModal(); };
  const handleWeightSubmit = () => { if (!tempInput) return; handleAddRecord('weight', `${tempInput}kg`, '체중'); };
  const handleSleepSubmit = () => { if (!tempSelection) { alert("수면 상태를 선택해주세요."); return; } const valueText = getGeneralScaleText(tempSelection); handleAddRecord('sleep', valueText, '수면'); };
  const handleStressSingleSubmit = () => { if (!tempSelection) { alert("스트레스 정도를 선택해주세요."); return; } const valueText = getStressText(tempSelection); handleAddRecord('stress', valueText, '스트레스'); };

  const analyzeCondition = (data) => {
      let summaryText = "오늘은 ";
      if (data.fatigue >= 4) summaryText += "피로도가 높았고 "; else summaryText += "피로도가 높지 않고 ";
      if (data.stress >= 4) summaryText += "스트레스가 심했지만 "; else summaryText += "스트레스는 높지 않았지만 ";
      if (data.diet === '폭식') summaryText += "폭식을 했네요."; else if (data.diet === '군것질') summaryText += "군것질을 많이 했네요."; else if (data.diet === '끼니 거름') summaryText += "끼니를 걸렀네요."; else summaryText += "식사는 적당히 했네요.";
      let adviceText = "";
      if (data.stress >= 4 && (data.diet === '폭식' || data.diet === '군것질')) adviceText = "스트레스를 많이 받으면 군것질 횟수도 늘어나고 평소보다 식사량이 늘어지는 통계를 볼 수 있었습니다. 오늘은 이만 푹 자고 내일 또 봐요.";
      else if (data.fatigue >= 4) adviceText = "몸이 많이 지쳐있는 것 같아요. 피로는 만병의 근원! 오늘은 만사 제쳐두고 일찍 잠자리에 드는 건 어떨까요? 따뜻한 물 샤워도 도움이 될 거예요.";
      else if (data.diet === '끼니 거름') adviceText = "바쁘더라도 끼니는 챙겨야죠! 규칙적인 식사는 건강한 다이어트의 기본입니다. 내일은 꼭 맛있는 밥 챙겨 드세요.";
      else if (data.mood <= 2) adviceText = "기분이 별로 좋지 않은 하루였군요. 달콤한 휴식과 함께 좋아하는 음악을 들으며 기분 전환을 해보세요. 내일은 더 좋은 일이 생길 거예요!";
      else adviceText = "전반적으로 컨디션 관리를 잘 하셨네요! 지금처럼 꾸준히 기록하고 관리하면 목표를 이룰 수 있을 거예요. 좋은 밤 되세요!";
      return { summary: summaryText, advice: adviceText };
  };

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

  const getMonthlyStats = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); 
    const weeklyStats = { 1: { fasting:0, snack:0, proper:0, binge:0, stressHigh:0, fatigueHigh:0 }, 2: { fasting:0, snack:0, proper:0, binge:0, stressHigh:0, fatigueHigh:0 }, 3: { fasting:0, snack:0, proper:0, binge:0, stressHigh:0, fatigueHigh:0 }, 4: { fasting:0, snack:0, proper:0, binge:0, stressHigh:0, fatigueHigh:0 }, 5: { fasting:0, snack:0, proper:0, binge:0, stressHigh:0, fatigueHigh:0 } };
    Object.keys(allData).forEach(dateKey => {
        const [y, m, d] = dateKey.split('-').map(Number);
        if (y === currentYear && m === (currentMonth + 1)) {
            const weekNum = Math.ceil(d / 7);
            const data = allData[dateKey];
            if (weekNum >= 1 && weekNum <= 5) {
                if (data.diet === '끼니 거름') weeklyStats[weekNum].fasting++;
                else if (data.diet === '군것질') weeklyStats[weekNum].snack++;
                else if (data.diet === '적당함 섭취') weeklyStats[weekNum].proper++;
                else if (data.diet === '폭식') weeklyStats[weekNum].binge++;
                if (data.stress >= 4) weeklyStats[weekNum].stressHigh++;
                if (data.fatigue >= 4) weeklyStats[weekNum].fatigueHigh++;
            }
        }
    });
    return weeklyStats;
  };

  const generateMonthlyReport = (stats) => {
      const weeklyTexts = {};
      [1, 2, 3, 4].forEach(week => {
          const s = stats[week];
          if (s.stressHigh >= 2 && s.binge >= 1) weeklyTexts[week] = { title: "스트레스 주의", desc: "스트레스가 식욕으로 이어진 주간이었어요. 휴식이 더 필요해요." };
          else if (s.fatigueHigh >= 2) weeklyTexts[week] = { title: "에너지 저하", desc: "피로가 누적되어 컨디션이 좋지 않았어요. 무리하지 마세요." };
          else if (s.binge >= 2) weeklyTexts[week] = { title: "식단 관리 필요", desc: "잦은 폭식이 있었어요. 규칙적인 식사 시간을 지켜보세요." };
          else weeklyTexts[week] = { title: "안정적인 흐름", desc: "전반적으로 몸과 마음의 균형이 잘 잡힌 한 주였어요. 훌륭해요!" };
      });
      let totalBinge = 0, totalStress = 0, totalFatigue = 0;
      Object.values(stats).forEach(s => { totalBinge += s.binge; totalStress += s.stressHigh; totalFatigue += s.fatigueHigh; });
      let userType = { title: "안정적인 관리형", desc: ["규칙적인 생활 패턴이 돋보입니다.", "감정 기복이 적고 식단 조절도 잘 하고 계시네요.", "지금의 루틴을 꾸준히 유지하는 것이 목표입니다!"] };
      let comments = ["현재 루틴 유지하기", "새로운 운동 도전해보기", "수분 섭취 신경 쓰기", "자신을 칭찬해주세요"];
      if (totalBinge >= 3) {
          userType = { title: "감정적 식습관 유형", desc: ["스트레스나 감정 변화가 식욕으로 이어지는 편입니다.", "특히 저녁 시간이나 혼자 있을 때 폭식 경향이 보여요.", "음식 대신 산책이나 명상으로 스트레스를 풀어보세요."] };
          comments = ["식사 일기 꼼꼼히 쓰기", "스트레스 해소법 찾기", "건강한 간식 준비하기", "배고픔과 갈망 구분하기"];
      } else if (totalStress >= 4 || totalFatigue >= 4) {
          userType = { title: "호르몬/컨디션 민감형", desc: ["신체 컨디션에 따라 기분과 식욕이 크게 좌우됩니다.", "PMS 기간이나 피로한 날에는 만사가 귀찮아질 수 있어요.", "내 몸의 신호를 잘 듣고 충분한 휴식을 취하는 게 중요해요."] };
          comments = ["충분한 수면 시간 확보", "따뜻한 차 마시기", "가벼운 스트레칭", "무리한 계획 세우지 않기"];
      }
      return { weeklyTexts, userType, comments };
  };

  const stats = getMonthlyStats();
  const report = generateMonthlyReport(stats);
  const todayForMonthly = new Date();
  
  const polylinePoints = `15,${100 - (stats[1].fatigueHigh/7)*100} 40,${100 - (stats[2].fatigueHigh/7)*100} 65,${100 - (stats[3].fatigueHigh/7)*100} 90,${100 - (stats[4].fatigueHigh/7)*100}`;


  return (
    <div className="app-container">
      {/*메인화면*/}
      {currentScreen === 'main' && (<div className="screen main-screen" onClick={handleStart}><h1 className="main-title">HAWD</h1><p className="main-subtitle">Have a wonderful day diet</p></div>)}
      
      {/*설문화면*/}
      {currentScreen === 'survey' && (<div className="survey-screen"><div className="survey-header"><p>HAWD에 온 당신을 환영합니다!</p></div><div className="questions-total">{questions.map((q) => (<div key={q.id} className="question-box"><div className="question-title">{q.title}</div><div className="options-container">{[0, 1, 2, 3, 4, 5].map((index) => (<div key={index} onClick={() => handleSelect(q.id, index)} className={`circle-option ${answers[q.id] === index ? 'selected' : ''}`} style={{ width: `${2.5 + (index * 0.4)}vw`, height: `${2.5 + (index * 0.4)}vw` }} />))}</div></div>))}</div><div className="submit-area"><button onClick={handleSubmit} className={`submit-button ${isAllAnswered ? 'active' : ''}`} disabled={!isAllAnswered}>Done</button></div></div>)}
      
      {/*결과화면*/}
      {currentScreen === 'result' && resultData && (<div className="result-screen"><div className="result-box"><div className="score-label-container"><div className="score-label">총점 수준</div></div><div className="score-display">[ {resultData.score} ]</div><div className="level-text">{resultData.level}</div><div className="message-box">{resultData.message}</div><button className="next-button" onClick={handleGoToCalendar}>Next &gt;</button></div></div>)}
      
      {/*캘린더화면*/}
      {currentScreen === 'calendar' && (<div className="calendar-screen"><div className="calendar-instruction">{cycleData.nextDate ? "기록된 날짜를 클릭하여 상세 정보를 확인하세요" : "월경주기 확인을 위해 최근 3번의 월경날짜를 기록해주세요"}</div><div className="calendar-container"><div className="calendar-header"><button onClick={handlePrevMonth}>◀</button><span className="month-display">{currentDate.getMonth() + 1}월</span><button onClick={handleNextMonth}>▶</button></div><div className="calendar-grid">{['일', '월', '화', '수', '목', '금', '토'].map(day => (<div key={day} className="calendar-weekday">{day}</div>))}{renderCalendarDays()}</div></div><div className="submit-area">{cycleData.nextDate === null ? (<button className="submit-button active" onClick={handleCalendarComplete}>Save Dates</button>) : (<button className="submit-button active" onClick={() => setCurrentScreen('daily')}>돌아가기</button>)}</div>{showModal && (<><div className="modal-overlay" onClick={closeAddModal}></div><div className="modal-sheet"><div className="modal-handle"></div>{modalStep === 'view_detail' && viewData && (<div className="modal-content detail-view-content"><h3 className="detail-date-title">{viewDate}</h3><div className="detail-row"><div className="detail-tag green">스트레스</div><span className="detail-text">{getStressText(viewData.stress)}</span></div><div className="detail-row"><div className="detail-tag blue">식생활</div><span className="detail-text">{viewData.diet} 성향을 보임</span></div><div className="detail-row"><div className="detail-tag orange">피로도</div><span className="detail-text">{getFatigueText(viewData.fatigue)}</span></div></div>)}</div></>)}</div>)}
      
      {/*일간리포트*/}
      {currentScreen === 'daily' && (<div className="daily-screen"><div className="daily-top-area"><h2 className="logo-small">HAWD</h2><p className="sub-small">Have a wonderful day diet</p><div className="tab-container"><button className="tab-button active">일간리포트</button><button className="tab-button" onClick={handleGoToCalendar}>캘린더</button><button className="tab-button" onClick={() => setCurrentScreen('monthly')}>월간리포트</button></div><div className="status-card"><div className="today-date-small">{formatToday()}</div><div className="d-day-text">{cycleData.dDay > 0 ? (<>월경 <span className="highlight-text">{cycleData.dDay}일 전</span></>) : cycleData.dDay === 0 ? (<span className="highlight-text">오늘이 월경 예정일입니다</span>) : (<>월경 <span className="highlight-text">{Math.abs(cycleData.dDay)}일 지남</span></>)}</div><div className="phase-badge">{cycleData.dDay >= 12 && cycleData.dDay <= 16 ? '배란기' : '황체기'}</div></div></div><div className="record-container"><div className="record-header"><h3>기록</h3></div><div className="date-navigator"><button onClick={handlePrevDay}>&lt;</button><span>{formatRecordDate(recordDate)}</span><button onClick={handleNextDay}>&gt;</button></div><div className="record-list-scroll"><div className="check-item-box"><div className="check-label">영양제</div><div className="check-row"><div className="icon-pill">💊</div><span>영양제 먹기</span><button className={`check-box ${dailyRecords.some(r => r.dateKey === getDateStringFromDate(recordDate) && r.type === 'supplement') ? 'checked' : ''}`} onClick={toggleSupplement}>✔</button></div></div>{dailyRecords.filter(record => record.dateKey === getDateStringFromDate(recordDate) && record.type !== 'supplement').map((record) => (<div key={record.id} className="check-item-box"><div className="check-label">{record.label}</div><div className="check-row"><div className="icon-pill">{getRecordIcon(record.type)}</div><span>{record.value}</span><button className="check-box checked">✔</button></div></div>))}<div className="check-item-box"><div className="check-label">건강 및 일상</div><div className="check-row add-row" onClick={openAddModal}><div className="icon-plus">⊕</div><span>기록 추가하기</span></div></div></div></div></div>)}
      
      {/*일간분석*/}
      {currentScreen === 'daily_analysis' && (<div className="daily-screen analysis-mode"><div className="daily-top-area"><button className="top-pill-button">일간리포트</button><div className="analysis-date-header">{formatToday()}</div></div><div className="message-banner"><p>오늘은 힘든 하루였군요 수고하셨습니다</p><p>오늘의 기록을 같이 살펴봅시다</p></div><div className="analysis-card"><div className="phase-badge-floating">{cycleData.dDay >= 12 && cycleData.dDay <= 16 ? '배란기' : '황체기'}{cycleData.dDay > 0 && ` (월경 ${cycleData.dDay}일 전)`}</div><div className="summary-box">{analysisResult.summary}</div><div className="advice-box"><div className="advice-title">한 마디</div><div className="advice-content">{analysisResult.advice}</div></div></div><div className="submit-area"><button className="submit-button active" onClick={() => setCurrentScreen('daily')}>돌아가기</button></div></div>)}
      
      {/*월간리포트*/}
      {currentScreen === 'monthly' && (<div className="monthly-screen"><div className="daily-top-area"><h2 className="logo-small">HAWD</h2><p className="sub-small">Have a wonderful day diet</p><div className="tab-container"><button className="tab-button" onClick={() => setCurrentScreen('daily')}>일간리포트</button><button className="tab-button" onClick={handleGoToCalendar}>캘린더</button><button className="tab-button active">월간리포트</button></div></div><div className="monthly-content-scroll">
          <div className="main-chart-card"><h3 className="chart-title">{todayForMonthly.getMonth() + 1}월의 식생활 기록</h3><div className="chart-area"><div className="chart-y-axis"><span>7</span><span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div><div className="bars-container">{[1, 2, 3, 4].map(week => (<div key={week} className="bar-group"><div className="bar blue" style={{height: `${(stats[week].fasting / 7) * 100}%`}}></div><div className="bar orange" style={{height: `${(stats[week].snack / 7) * 100}%`}}></div><div className="bar grey" style={{height: `${(stats[week].proper / 7) * 100}%`}}></div><div className="bar yellow" style={{height: `${(stats[week].binge / 7) * 100}%`}}></div><span className="x-label">{week}주</span></div>))}</div></div><div className="chart-legend"><span className="legend-item"><span className="dot blue"></span>절식</span><span className="legend-item"><span className="dot orange"></span>군것질</span><span className="legend-item"><span className="dot grey"></span>적정</span><span className="legend-item"><span className="dot yellow"></span>폭식</span></div><button className="view-report-btn">주기별 리포트 보기</button></div>
          <div className="text-analysis-card">
              {[1, 2, 3, 4].map(week => (
                  <div key={week} className="analysis-item">
                      <h4>{week}주차 — {report.weeklyTexts[week].title}</h4>
                      <p>{report.weeklyTexts[week].desc}</p>
                  </div>
              ))}
          </div>
          <div className="chart-card"><div className="chart-area combo-chart"><div className="chart-y-axis"><span>7</span><span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div><div className="bars-container relative"><svg className="line-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points={polylinePoints} fill="none" stroke="#999" strokeWidth="2" /></svg>{[1, 2, 3, 4].map(week => (<div key={week} className="bar-group"><div className="bar blue" style={{height: `${(stats[week].stressHigh / 7) * 100}%`}}></div><div className="bar orange" style={{height: `${(stats[week].binge / 7) * 100}%`}}></div><span className="x-label">{week}주</span></div>))}</div></div><div className="chart-legend"><span className="legend-item"><span className="dot blue"></span>스트레스 4↑</span><span className="legend-item"><span className="dot orange"></span>폭식</span><span className="legend-item"><span className="line-legend"></span>피로도 4↑</span></div><div className="analysis-box-bottom"><h4>🌙 {todayForMonthly.getMonth() + 1}월 월간 패턴 분석</h4><h5 style={{marginTop:'15px', fontSize:'1rem'}}>전체적인 흐름</h5><p>파란 막대(스트레스)가 높을 때 꺾은선(피로도)도 같이 올라가는지 확인해보세요. 두 가지가 겹칠 때 폭식(주황 막대)이 발생하는지 관찰하는 것이 핵심입니다.</p></div></div>
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
      </div></div>)}

      {/* Shared Modals */}
      {(currentScreen === 'daily' || currentScreen === 'daily_analysis') && showModal && (<><div className="modal-overlay" onClick={closeAddModal}></div><div className="modal-sheet"><div className="modal-handle"></div>{modalStep === 'menu' && (<div className="modal-content"><h3 className="modal-title">기록 추가</h3><div className="modal-grid"><div className="modal-item" onClick={() => setModalStep('weight')}><div className="circle-btn color-navy"></div><span>체중</span></div><div className="modal-item" onClick={() => setModalStep('sleep_detail')}><div className="circle-btn color-orange"></div><span>수면</span></div><div className="modal-item" onClick={() => setModalStep('stress_detail_single')}><div className="circle-btn color-olive"></div><span>스트레스</span></div><div className="modal-item" onClick={() => setModalStep('condition_detail')}><div className="circle-btn color-yellow"></div><span>몸 상태</span></div></div></div>)}{modalStep === 'weight' && (<div className="modal-content"><h3 className="modal-title">체중 기록</h3><div className="input-group"><input type="number" placeholder="kg" value={tempInput} onChange={(e) => setTempInput(e.target.value)} className="modal-input"/><button className="save-btn" onClick={handleWeightSubmit}>저장</button></div><button className="back-btn" onClick={() => setModalStep('menu')}>뒤로가기</button></div>)}{modalStep === 'sleep_detail' && (<div className="modal-content condition-content"><h3 className="modal-title">수면 상태</h3><div className="condition-row"><div className="scale-container"><span className="scale-text">나쁨</span>{[1,2,3,4,5].map(v => (<div key={v} className={`circle-scale ${tempSelection === v ? 'active' : ''}`} onClick={() => setTempSelection(v)}></div>))}<span className="scale-text">좋음</span></div></div><button className="save-btn full-width" onClick={handleSleepSubmit}>저장</button><button className="back-btn full-width" onClick={() => setModalStep('menu')} style={{marginTop:'10px'}}>뒤로가기</button></div>)}{modalStep === 'stress_detail_single' && (<div className="modal-content condition-content"><h3 className="modal-title">스트레스 정도</h3><div className="condition-row"><div className="scale-container"><span className="scale-text">낮음</span>{[1,2,3,4,5].map(v => (<div key={v} className={`circle-scale ${tempSelection === v ? 'active' : ''}`} onClick={() => setTempSelection(v)}></div>))}<span className="scale-text">높음</span></div></div><button className="save-btn full-width" onClick={handleStressSingleSubmit}>저장</button><button className="back-btn full-width" onClick={() => setModalStep('menu')} style={{marginTop:'10px'}}>뒤로가기</button></div>)}{modalStep === 'condition_detail' && (<div className="modal-content condition-content"><div className="condition-row"><div className="con-label">피로도</div><div className="scale-container"><span className="scale-text">좋음</span>{[1,2,3,4,5].map(v => (<div key={v} className={`circle-scale ${conditionData.fatigue === v ? 'active' : ''}`} onClick={() => setConditionData({...conditionData, fatigue: v})}></div>))}<span className="scale-text">나쁨</span></div></div><div className="condition-row"><div className="con-label">스트레스 정도</div><div className="scale-container"><span className="scale-text">낮음</span>{[1,2,3,4,5].map(v => (<div key={v} className={`circle-scale ${conditionData.stress === v ? 'active' : ''}`} onClick={() => setConditionData({...conditionData, stress: v})}></div>))}<span className="scale-text">높음</span></div></div><div className="condition-row"><div className="con-label">식생활</div><div className="pill-group">{['끼니 거름', '군것질', '적당함 섭취', '폭식'].map(opt => (<button key={opt} className={`pill-btn ${conditionData.diet === opt ? 'active' : ''}`} onClick={() => setConditionData({...conditionData, diet: opt})}>{opt}</button>))}</div></div><div className="condition-row"><div className="con-label">오늘 기분</div><div className="scale-container"><span className="scale-text">나쁨</span>{[1,2,3,4,5].map(v => (<div key={v} className={`circle-scale ${conditionData.mood === v ? 'active' : ''}`} onClick={() => setConditionData({...conditionData, mood: v})}></div>))}<span className="scale-text">좋음</span></div></div><button className="save-btn full-width" onClick={handleConditionSubmit}>제출</button></div>)}{modalStep === 'condition_success' && (<div className="modal-content success-overlay"><div className="success-icon">✔</div><div className="success-text">오늘 기록도 완료 !!</div><div className="success-heart">♥</div></div>)}</div><div className="modal-overlay" onClick={closeAddModal}></div></>)}
    </div>
  );
}

export default App;