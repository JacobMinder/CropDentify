import React, { useEffect, useRef, useState } from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    if (!capturedImage) return;

    setIsLoading(true);

    fetch('http://localhost:8080/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: capturedImage })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Analysis result:", data);
        setAnalysisResult(data);
      })
      .catch((error) => {
        console.error('Error analyzing the image:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
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

      <div className="image-box">
        <h3>Captured Image:</h3>
        {capturedImage ? (
          <>
            <img src={capturedImage} alt="Captured" className="captured-image" />
            <button
              onClick={analyzePicture}
              className="analyze-button"
              style={{
                backgroundColor: isLoading ? 'gray' : '#4CAF50',
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Analyze'}
            </button>
          </>
        ) : (
          <div className="placeholder">No image captured yet</div>
        )}
      </div>

      {analysisResult && (
        <div className="analysis-results">
          <h3>
            <strong>{analysisResult.model_output.result}</strong>
          </h3>
          <ul>
            {analysisResult.model_output.advice ? (
              analysisResult.model_output.advice
                .split("\n• ")
                .map((adviceItem: string, index: number) => (
                  <li key={index} style={{ color: 'red' }}>
                    {adviceItem}
                  </li>
                ))
            ) : (
              <p>No advice available.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomePage;
