import React, { useState } from 'react'
import Cell from './Cell'
import './Grid.css'

function Grid() {

  // Initialize state for grid cells
  const [cellStates, setCellStates] = useState([false, false, false, false])
  
  // Count how many cells are now active
  const activeCount = cellStates.filter(state => state).length
  
  // Cell click event
  const handleCellClick = (index) => {
    const newStates = [...cellStates]
    newStates[index] = !newStates[index]
    setCellStates(newStates)
  }
  
  return (
    <div className="grid-container">
      <div className="counter">Count: {activeCount}</div>
      <div className="grid">
        {cellStates.map((isActive, index) => (
          <Cell 
            key={index} 
            isActive={isActive} // Parent passes boolean property cell active state to child
            onClick={() => handleCellClick(index)} // Parent passes function cell click property to child
          />
        ))}
      </div>
    </div>
  )
}

export default Grid