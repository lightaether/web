import React, { useState, useEffect } from 'react';
import { GameView } from './GameView';

import { AVAILABLE_SHIPS, SQUARE_STATE } from '../utils/gameConfig';
import { gameLogic } from '../utils/gameLogic';

// Local storage utility functions to save/load game state
const loadStateFromLocalStorage = () => {
  const savedState = localStorage.getItem('gameState');
  return savedState ? JSON.parse(savedState) : null;
};

const saveStateToLocalStorage = (state) => {
  localStorage.setItem('gameState', JSON.stringify(state));
};

const clearLocalStorage = () => {
  localStorage.removeItem('gameState');
};

export const Game = (mode) => {
  // Load saved game state from local storage if available
  const savedState = loadStateFromLocalStorage();

  // Game state and ship management
  const [gameState, setGameState] = useState(savedState?.gameState || 'placement');
  const [winner, setWinner] = useState(savedState?.winner || null);
  const [currentlyPlacing, setCurrentlyPlacing] = useState(savedState?.currentlyPlacing || null);
  const [placedShips, setPlacedShips] = useState(savedState?.placedShips || []);
  const [availableShips, setAvailableShips] = useState(savedState?.availableShips || AVAILABLE_SHIPS);
  const [computerShips, setComputerShips] = useState(savedState?.computerShips || []);
  const [hitsByPlayer, setHitsByPlayer] = useState(savedState?.hitsByPlayer || []);
  const [hitsByComputer, setHitsByComputer] = useState(savedState?.hitsByComputer || []);

  // Save game state to local storage whenever state changes
  useEffect(() => {
    const stateToSave = {
      gameState,
      winner,
      currentlyPlacing,
      placedShips,
      availableShips,
      computerShips,
      hitsByPlayer,
      hitsByComputer,
    };
    saveStateToLocalStorage(stateToSave);
  }, [
    gameState,
    winner,
    currentlyPlacing,
    placedShips,
    availableShips,
    computerShips,
    hitsByPlayer,
    hitsByComputer,
  ]);

  // Select a ship to place on the board
  const chooseShip = (shipName) => {
    let shipIdx = availableShips.findIndex((ship) => ship.name === shipName);
    const shipToPlace = availableShips[shipIdx];

    setCurrentlyPlacing({
      ...shipToPlace,
      orientation: 'horizontal',
      position: null,
    });
  };

  // Place the selected ship on the board
  const placeShip = (currentlyPlacing) => {
    setPlacedShips([
      ...placedShips,
      {
        ...currentlyPlacing,
        placed: true,
      },
    ]);

    setAvailableShips((previousShips) =>
      previousShips.filter((ship) => ship.name !== currentlyPlacing.name)
    );

    setCurrentlyPlacing(null);
  };

  // Start the game after ship placement phase
  const startTurn = () => {
    generateComputerShips();
    setGameState('player-turn');
  };

  // Switch turns between player and computer
  const changeTurn = () => {
    setGameState((oldGameState) =>
      oldGameState === 'player-turn' ? 'computer-turn' : 'player-turn'
    );
  };

  // Randomly place all computer ships
  const generateComputerShips = () => {
    let placedComputerShips = gameLogic.randomDeployShips(AVAILABLE_SHIPS.slice());
    setComputerShips(placedComputerShips);
  };

  // Handle computer's attack on player's board
  const computerFire = (index, layout) => {
    let computerHits;

    if (layout[index] === 'ship') {
      computerHits = [
        ...hitsByComputer,
        {
          position: gameLogic.indexToCoords(index),
          type: SQUARE_STATE.hit,
        },
      ];
    }
    if (layout[index] === 'empty') {
      computerHits = [
        ...hitsByComputer,
        {
          position: gameLogic.indexToCoords(index),
          type: SQUARE_STATE.miss,
        },
      ];
    }
    const sunkShips = gameLogic.updateSunkShips(computerHits, placedShips);

    setPlacedShips(sunkShips);
    setHitsByComputer(computerHits);
  };

  // Computer's turn logic with targeting strategy
  const handleComputerTurn = () => {
    changeTurn();

    if (checkIfGameOver()) {
      return;
    }

    // Generate current board layout
    let layout = placedShips.reduce(
      (prevLayout, currentShip) =>
        gameLogic.updateLayout(prevLayout, currentShip, SQUARE_STATE.ship),
      gameLogic.generateEmptyLayout()
    );

    layout = hitsByComputer.reduce(
      (prevLayout, currentHit) =>
        gameLogic.updateLayout(prevLayout, currentHit, currentHit.type),
      layout
    );

    layout = placedShips.reduce(
      (prevLayout, currentShip) =>
        currentShip.sunk
          ? gameLogic.updateLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk)
          : prevLayout,
      layout
    );

    // AI targeting strategy: First try to hit squares adjacent to successful hits
    let successfulComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit');

    let nonSunkComputerHits = successfulComputerHits.filter((hit) => {
      const hitIndex = gameLogic.coordsToIndex(hit.position);
      return layout[hitIndex] === 'hit';
    });

    let potentialTargets = nonSunkComputerHits
      .flatMap((hit) => gameLogic.getNeighbors(hit.position))
      .filter((idx) => layout[idx] === 'empty' || layout[idx] === 'ship');

    // If no adjacent targets, select randomly from all remaining valid squares
    if (potentialTargets.length === 0) {
      let layoutIndices = layout.map((item, idx) => idx);
      potentialTargets = layoutIndices.filter(
        (index) => layout[index] === 'ship' || layout[index] === 'empty'
      );
    }

    let randomIndex = gameLogic.generateRandomIndex(potentialTargets.length);

    let target = potentialTargets[randomIndex];

    // Fire after a short delay to make AI turn visible to player
    setTimeout(() => {
      computerFire(target, layout);
      changeTurn();
    }, 300);
  };

  // Check if game is over (all ships of either player or computer are sunk)
  const checkIfGameOver = () => {
    let successfulPlayerHits = hitsByPlayer.filter((hit) => hit.type === 'hit').length;
    let successfulComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit')
      .length;

    // 17 is the total number of ship squares (5+4+3+3+2)
    if (successfulComputerHits === 17 || successfulPlayerHits === 17) {
      clearLocalStorage();
      setGameState('game-over');

      if (successfulComputerHits === 17) {
        setWinner('computer');
      }

      if (successfulPlayerHits === 17) {
        setWinner('player');
      }

      return true;
    }

    return false;
  };

  // Reset game state to start a new game
  const startAgain = () => {
    setGameState('placement');
    setWinner(null);
    setCurrentlyPlacing(null);
    setPlacedShips([]);
    setAvailableShips(AVAILABLE_SHIPS);
    setComputerShips([]);
    setHitsByPlayer([]);
    setHitsByComputer([]);
    clearLocalStorage();
  };

  return (
    <React.Fragment>
      <GameView
        mode={mode}
        availableShips={availableShips}
        chooseShip={chooseShip}
        currentlyPlacing={currentlyPlacing}
        setCurrentlyPlacing={setCurrentlyPlacing}
        placeShip={placeShip}
        placedShips={placedShips}
        startTurn={startTurn}
        computerShips={computerShips}
        gameState={gameState}
        changeTurn={changeTurn}
        hitsByPlayer={hitsByPlayer}
        setHitsByPlayer={setHitsByPlayer}
        hitsByComputer={hitsByComputer}
        setHitsByComputer={setHitsByComputer}
        handleComputerTurn={handleComputerTurn}
        checkIfGameOver={checkIfGameOver}
        startAgain={startAgain}
        winner={winner}
        setComputerShips={setComputerShips}
      />
    </React.Fragment>
  );
};
