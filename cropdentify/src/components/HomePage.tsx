import React, { useEffect, useRef, useState } from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera: ", error);
      }
    };

    getCameraStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
      }
    }
  };

  const takeTimedPicture = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          takePicture();
          return null;
        }
        return (prev ?? 0) - 1;
      });
    }, 1000);
  };

  const importPicture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCapturedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const analyzePicture = () => {
    // Add logic to analyze the captured image
    console.log("Analyzing image...");
  };

  return (
    <div className="camera-container">
      <h2>Live Camera Feed</h2>
      <video ref={videoRef} autoPlay playsInline width="100%" className="camera-feed" />
      <div className="button-container">
        <button onClick={takePicture} className="capture-button">Take Picture</button>
        <button onClick={takeTimedPicture} className="timed-capture-button">
          {countdown !== null ? `Capture in ${countdown}` : 'Capture in 3 seconds'}
        </button>
        <button onClick={importPicture} className="import-button">Import Picture</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* White box with label before the picture is taken */}
      <div className="image-box">
        <h3>Captured Image:</h3>
        {capturedImage ? (
          <>
            <img src={capturedImage} alt="Captured" className="captured-image" />
            <button onClick={analyzePicture} className="analyze-button">Analyze</button>
          </>
        ) : (
          <div className="placeholder">No image captured yet</div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
