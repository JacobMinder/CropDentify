import React, { useRef, useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import InfoPage from './components/InfoPage';
import Header from './components/Header';
import './App.css';
import axios from "axios";

function App() {
  const streamRef = useRef<MediaStream | null>(null);
  
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api/users");
    console.log(response.data.users)
  }
  useEffect(() => {
    fetchAPI()
  }, [])
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  return (
    <Router>
<Header 
  title={
    <span>
      m
      <span style={{ color: 'yellow' }}>a</span>
      <span style={{ color: 'green' }}>i</span>
      z
    </span>
  } 
  stopCamera={stopCamera} 
/>
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
