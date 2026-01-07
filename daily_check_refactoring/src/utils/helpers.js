// src/utils/helpers.js

// 질문 리스트
export const questions = [
  { id: 1, title: '1. 지난 28일 동안, 체중이나 체형에 영향을 주기 위해 일부러 먹는 양을 줄이거나 식사를 제한하려고 노력한 정도는 어느 정도인가?' },
  { id: 2, title: '2. 음식을 먹을 때, 먹는 행동을 스스로 조절하지 못한다고 느낀 순간이 얼마나 자주 있었는가?' },
  { id: 3, title: '3. 짧은 시간 안에 평소보다 훨씬 많은 양의 음식을 먹은 적이 얼마나 있었는가?' },
  { id: 4, title: '4. 체중 증가를 막기 위해 구토, 금식, 약물(이뇨제, 하제), 또는 지나친 운동과 같은 보상행동을 한 빈도는 어느 정도인가?' },
  { id: 5, title: '5. 지난 28일 동안 체형이나 체중에 대해 걱정하거나 불안해 한 빈도는 어느 정도인가?' },
  { id: 6, title: '6. 자신의 제형에 대해, 다른 사람들보다 더 뚱뚱하다고 느낀 정도는 어느 정도인가?' },
  { id: 7, title: '7. 체중 또는 체형이 자신의 가치감이나 자존감을 결정하는 데 큰 역할을 했는가?' },
  { id: 8, title: '8. 지난 28일간 몸무게를 재거나, 거울 혹은 신체 부분을 반복적으로 확인한 빈도는 어느 정도인가?' },
];

// 더미 데이터 생성
export const getDummyData = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    return {
        [`${y}-${m}-01`]: { fatigue: 2, stress: 1, diet: '적당함 섭취', mood: 4, timestamp: Date.now() },
        [`${y}-${m}-02`]: { fatigue: 1, stress: 2, diet: '적당함 섭취', mood: 3, timestamp: Date.now() },
        [`${y}-${m}-05`]: { fatigue: 2, stress: 1, diet: '군것질', mood: 2, timestamp: Date.now() }, 
        [`${y}-${m}-08`]: { fatigue: 4, stress: 5, diet: '폭식', mood: 1, timestamp: Date.now() },
        [`${y}-${m}-09`]: { fatigue: 5, stress: 4, diet: '폭식', mood: 2, timestamp: Date.now() },
        [`${y}-${m}-15`]: { fatigue: 5, stress: 5, diet: '폭식', mood: 1, timestamp: Date.now() },
        [`${y}-${m}-16`]: { fatigue: 4, stress: 4, diet: '군것질', mood: 2, timestamp: Date.now() },
        [`${y}-${m}-22`]: { fatigue: 2, stress: 1, diet: '적당함 섭취', mood: 4, timestamp: Date.now() },
        [`${y}-${m}-24`]: { fatigue: 1, stress: 1, diet: '적당함 섭취', mood: 5, timestamp: Date.now() },
    };
};

// 날짜 포맷 함수들
export const getDateKey = (year, month, day) => {
    const strMonth = String(month + 1).padStart(2, '0');
    const strDay = String(day).padStart(2, '0');
    return `${year}-${strMonth}-${strDay}`;
};

export const getDateStringFromDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export const formatRecordDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    return `${month}월 ${day}일 (${dayName})${isToday ? ', 오늘' : ''}`;
}

export const formatToday = () => {
    const today = new Date();
    return `${today.getMonth() + 1}월 ${today.getDate()}일 (${['일', '월', '화', '수', '목', '금', '토'][today.getDay()]})`;
}

// 텍스트 변환 헬퍼
export const getStressText = (level) => level <= 1 ? "매우 낮음" : level === 2 ? "낮음" : level === 3 ? "보통" : level === 4 ? "높음" : "매우 높음";
export const getFatigueText = (level) => level <= 1 ? "매우 좋음" : level === 2 ? "좋음" : level === 3 ? "보통" : level === 4 ? "피곤함" : "매우 피곤함";
export const getGeneralScaleText = (level) => { if (level === 1) return "매우 나쁨"; if (level === 2) return "나쁨"; if (level === 3) return "보통"; if (level === 4) return "좋음"; if (level === 5) return "매우 좋음"; return ""; };
export const getRecordIcon = (type) => { switch(type) { case 'weight': return '⚖️'; case 'sleep': return '💤'; case 'stress': return '⚡'; case 'condition': return '💗'; case 'supplement': return '💊'; default: return '📝'; } };

// 분석 로직
export const analyzeCondition = (data) => {
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

// 월간 통계 계산
export const getMonthlyStats = (allData) => {
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

// 월간 리포트 멘트 생성
export const generateMonthlyReport = (stats) => {
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