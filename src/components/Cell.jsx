// Cell.js (Child Component)
// Using funtional components
import React from 'react';
import './Cell.css';

function Cell({ isActive, onClick }) {
  return (
    <div 
      className={`cell ${isActive ? 'active' : ''}`}
      onClick={onClick}
    />
  );
}

export default Cell;