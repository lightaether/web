import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import {Game} from './components/Game';
import Rules from './components/Rules';
import Navbar from './components/Navbar';
import Scores from './components/Scores';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/game/normal" element={<Game mode="normal" />} />
        <Route path="/game/easy" element={<Game mode="easy" />} />
      </Routes>
    </Router>
  );
}

export default App;