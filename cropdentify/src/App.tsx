import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import InfoPage from './components/InfoPage';
import Header from './components/Header';
import './App.css';

function App() {
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  return (
    <Router>
      <Header title="CropDentify" stopCamera={stopCamera} />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/info" element={<InfoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
