import React from 'react';

import { PlayerFleet } from './PlayerFleet';
import { PlayerBoard } from './PlayerBoard';
import { AIBoard } from './AIBoard';
import { PlayerInfo } from './PlayerInfo';

export const GameView = ({
  mode,
  availableShips,
  chooseShip,
  currentlyPlacing,
  setCurrentlyPlacing,
  placeShip,
  placedShips,
  startTurn,
  computerShips,
  gameState,
  changeTurn,
  hitComputer,
  hitsByPlayer,
  setHitsByPlayer,
  hitsByComputer,
  handleComputerTurn,
  checkIfGameOver,
  winner,
  startAgain,
  setComputerShips,
}) => {
  return (
    <section id="game-screen">
      {mode.mode === 'easy' ? (
        <>
            <AIBoard
            computerShips={computerShips}
            changeTurn={changeTurn}
            gameState={gameState}
            hitComputer={hitComputer}
            hitsByPlayer={hitsByPlayer}
            setHitsByPlayer={setHitsByPlayer}
            handleComputerTurn={handleComputerTurn}
            checkIfGameOver={checkIfGameOver}
            setComputerShips={setComputerShips}
            />
            <div className="d-flex justify-content-center gap-3 mt-3">
                <button className="btn btn-primary" onClick={startTurn}>
                Start
                </button>
                <button className="btn btn-danger" onClick={startAgain}>
                Restart
                </button>
            </div>
        </>
      ) : (
        <>
        {gameState !== 'placement' ? (
            <PlayerInfo
            gameState={gameState}
            hitsbyPlayer={hitsByPlayer}
            hitsByComputer={hitsByComputer}
            winner={winner}
            startAgain={startAgain}
            />
        ) : (
            <PlayerFleet
            availableShips={availableShips}
            chooseShip={chooseShip}
            currentlyPlacing={currentlyPlacing}
            startTurn={startTurn}
            startAgain={startAgain}
            />
        )}

        <PlayerBoard
            currentlyPlacing={currentlyPlacing}
            setCurrentlyPlacing={setCurrentlyPlacing}
            placeShip={placeShip}
            placedShips={placedShips}
            hitsByComputer={hitsByComputer}
        />
        <AIBoard
            computerShips={computerShips}
            changeTurn={changeTurn}
            gameState={gameState}
            hitComputer={hitComputer}
            hitsByPlayer={hitsByPlayer}
            setHitsByPlayer={setHitsByPlayer}
            handleComputerTurn={handleComputerTurn}
            checkIfGameOver={checkIfGameOver}
            setComputerShips={setComputerShips}
        />
        </>
      )}
    </section>
  );
};