import React, { useEffect, useRef } from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null); // Reference to hold the stream

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream; // Store the stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera: ", error);
      }
    };

    getCameraStream();

    // Cleanup: Stop the video stream when component is unmounted
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop()); // Stop all tracks
        streamRef.current = null; // Clear the stream reference
      }
    };
  }, []);

  return (
    <div className="camera-container">
      <h2>Live Camera Feed</h2>
      <video ref={videoRef} autoPlay playsInline width="100%" className="camera-feed" />
    </div>
  );
};

export default HomePage;
