import React from 'react';
import './InfoPage.css'; // Import the CSS file for styling

const InfoPage: React.FC = () => {
  return (
    <div className="info-container">
      <h2 className="info-title">Information Page</h2>
      <p className="info-text">
        Welcome to the Info Page! Here you can find more details about how to use the CropDentify app.
      </p>
      <p className="info-text">
        CropDentify is designed to help you easily upload, analyze, and manage your images. Click "Choose File" on the main page to get started.
      </p>
    </div>
  );
};

export default InfoPage;
