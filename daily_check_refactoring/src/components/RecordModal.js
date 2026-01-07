import React from 'react';
import { getStressText, getFatigueText } from '../utils/helpers';

function RecordModal({ 
  showModal, 
  onClose, 
  modalStep, 
  setModalStep, 
  tempInput, 
  setTempInput, 
  handleWeightSubmit, 
  handleAddRecord, 
  setTempSelection, 
  tempSelection, 
  handleSleepSubmit, 
  handleStressSingleSubmit, 
  conditionData, 
  setConditionData, 
  handleConditionSubmit,
  viewData,
  viewDate
}) {
  if (!showModal) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-sheet">
        <div className="modal-handle"></div>
        
        {/* 메뉴 선택 */}
        {modalStep === 'menu' && (
          <div className="modal-content">
            <h3 className="modal-title">기록 추가</h3>
            <div className="modal-grid">
              <div className="modal-item" onClick={() => setModalStep('weight')}><div className="circle-btn color-navy"></div><span>체중</span></div>
              <div className="modal-item" onClick={() => setModalStep('sleep_detail')}><div className="circle-btn color-orange"></div><span>수면</span></div>
              <div className="modal-item" onClick={() => setModalStep('stress_detail_single')}><div className="circle-btn color-olive"></div><span>스트레스</span></div>
              <div className="modal-item" onClick={() => setModalStep('condition_detail')}><div className="circle-btn color-yellow"></div><span>몸 상태</span></div>
            </div>
          </div>
        )}

        {/* 체중 입력 */}
        {modalStep === 'weight' && (
          <div className="modal-content">
            <h3 className="modal-title">체중 기록</h3>
            <div className="input-group">
              <input type="number" placeholder="kg" value={tempInput} onChange={(e) => setTempInput(e.target.value)} className="modal-input"/>
              <button className="save-btn" onClick={handleWeightSubmit}>저장</button>
            </div>
            <button className="back-btn" onClick={() => setModalStep('menu')}>뒤로가기</button>
          </div>
        )}

        {/* 수면 입력 */}
        {modalStep === 'sleep_detail' && (
          <div className="modal-content condition-content">
            <h3 className="modal-title">수면 상태</h3>
            <div className="condition-row">
              <div className="scale-container">
                <span className="scale-text">나쁨</span>
                {[1,2,3,4,5].map(v => (<div key={v} className={`circle-scale ${tempSelection === v ? 'active' : ''}`} onClick={() => setTempSelection(v)}></div>))}
                <span className="scale-text">좋음</span>
              </div>
            </div>
            <button className="save-btn full-width" onClick={handleSleepSubmit}>저장</button>
            <button className="back-btn full-width" onClick={() => setModalStep('menu')} style={{marginTop:'10px'}}>뒤로가기</button>
          </div>
        )}

        {/* 스트레스 입력 */}
        {modalStep === 'stress_detail_single' && (
          <div className="modal-content condition-content">
            <h3 className="modal-title">스트레스 정도</h3>
            <div className="condition-row">
              <div className="scale-container">
                <span className="scale-text">낮음</span>
                {[1,2,3,4,5].map(v => (<div key={v} className={`circle-scale ${tempSelection === v ? 'active' : ''}`} onClick={() => setTempSelection(v)}></div>))}
                <span className="scale-text">높음</span>
              </div>
            </div>
            <button className="save-btn full-width" onClick={handleStressSingleSubmit}>저장</button>
            <button className="back-btn full-width" onClick={() => setModalStep('menu')} style={{marginTop:'10px'}}>뒤로가기</button>
          </div>
        )}

        {/* 몸 상태 상세 입력 */}
        {modalStep === 'condition_detail' && (
          <div className="modal-content condition-content">
            <div className="condition-row">
              <div className="con-label">피로도</div>
              <div className="scale-container"><span className="scale-text">좋음</span>{[1,2,3,4,5].map(v => (<div key={v} className={`circle-scale ${conditionData.fatigue === v ? 'active' : ''}`} onClick={() => setConditionData({...conditionData, fatigue: v})}></div>))}<span className="scale-text">나쁨</span></div>
            </div>
            <div className="condition-row">
              <div className="con-label">스트레스 정도</div>
              <div className="scale-container"><span className="scale-text">낮음</span>{[1,2,3,4,5].map(v => (<div key={v} className={`circle-scale ${conditionData.stress === v ? 'active' : ''}`} onClick={() => setConditionData({...conditionData, stress: v})}></div>))}<span className="scale-text">높음</span></div>
            </div>
            <div className="condition-row">
              <div className="con-label">식생활</div>
              <div className="pill-group">{['끼니 거름', '군것질', '적당함 섭취', '폭식'].map(opt => (<button key={opt} className={`pill-btn ${conditionData.diet === opt ? 'active' : ''}`} onClick={() => setConditionData({...conditionData, diet: opt})}>{opt}</button>))}</div>
            </div>
            <div className="condition-row">
              <div className="con-label">오늘 기분</div>
              <div className="scale-container"><span className="scale-text">나쁨</span>{[1,2,3,4,5].map(v => (<div key={v} className={`circle-scale ${conditionData.mood === v ? 'active' : ''}`} onClick={() => setConditionData({...conditionData, mood: v})}></div>))}<span className="scale-text">좋음</span></div>
            </div>
            <button className="save-btn full-width" onClick={handleConditionSubmit}>제출</button>
          </div>
        )}

        {/* 완료 화면 */}
        {modalStep === 'condition_success' && (
          <div className="modal-content success-overlay">
            <div className="success-icon">✔</div>
            <div className="success-text">오늘 기록도 완료 !!</div>
            <div className="success-heart">♥</div>
          </div>
        )}

        {/* 캘린더 상세 보기 (View Mode) */}
        {modalStep === 'view_detail' && viewData && (
          <div className="modal-content detail-view-content">
            <h3 className="detail-date-title">{viewDate}</h3>
            <div className="detail-row"><div className="detail-tag green">스트레스</div><span className="detail-text">{getStressText(viewData.stress)}</span></div>
            <div className="detail-row"><div className="detail-tag blue">식생활</div><span className="detail-text">{viewData.diet} 성향을 보임</span></div>
            <div className="detail-row"><div className="detail-tag orange">피로도</div><span className="detail-text">{getFatigueText(viewData.fatigue)}</span></div>
          </div>
        )}
      </div>
    </>
  );
}
export default RecordModal;