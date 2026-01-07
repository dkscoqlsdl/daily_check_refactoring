import React from 'react';

function MainScreen({ onStart }) {
  return (
    <div className="screen main-screen" onClick={onStart}>
      <h1 className="main-title">HAWD</h1>
      <p className="main-subtitle">Have a wonderful day diet</p>
    </div>
  );
}
export default MainScreen;