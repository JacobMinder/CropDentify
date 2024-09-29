import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import InfoPage from './components/InfoPage';
import Header from './components/Header';
import './App.css';
import axios from 'axios';
import { PinataSDK } from "pinata";

// Initialize Pinata SDK with the environment variable
const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwOWQyNWY1Ny1kN2IxLTQ1ZmEtOTM3MC05Y2EyOWM5YTU5ZDciLCJlbWFpbCI6Impha2V3bWluZGVyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjNzk1YzY2MjUwODE3NWUxMWE1NyIsInNjb3BlZEtleVNlY3JldCI6IjUxMzQzMDZkZjI0OGFkMjJkNzYwMDdmYjkyODYxNDY3MWZjOTc5NGZlNzdiZDQ2YTcwOGFhMjc1NDExNDA0ZTEiLCJleHAiOjE3NTkwOTAzNTl9.gXylSJt7KE4_tq14Kq-H6jPvECfFcTWdBF6a6F8x1b8",
  pinataGateway: "fuchsia-actual-gopher-288.mypinata.cloud",
});

function App() {
    const streamRef = useRef<MediaStream | null>(null);
    const [pinataData, setPinataData] = useState<any>(null);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);

    // Function to fetch users from your API
    const fetchAPI = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/users");
            console.log(response.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Function to fetch data from Pinata
    const fetchPinataData = async () => {
        try {
            const data = await pinata.gateways.get("bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq");
            console.log(data);
            setPinataData(data); // Store data in state

            const url = await pinata.gateways.createSignedURL({
                cid: "bafkreib4pqtikzdjlj4zigobmd63lig7u6oxlug24snlr6atjlmlza45dq",
                expires: 1800,
            });
            console.log(url);
            setSignedUrl(url); // Store signed URL in state
        } catch (error) {
            console.error("Error fetching Pinata data:", error);
        }
    };

    useEffect(() => {
        fetchAPI();          // Fetch users from your API
        fetchPinataData();  // Fetch data from Pinata
    }, []);
  
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
            {/* You can render the Pinata data or signed URL here for testing */}
            <div>
                <h2>Pinata Data:</h2>
                {pinataData && <pre>{JSON.stringify(pinataData, null, 2)}</pre>}
                {signedUrl && <p>Signed URL: <a href={signedUrl} target="_blank" rel="noopener noreferrer">{signedUrl}</a></p>}
            </div>
        </Router>
    );
}

export default App;
