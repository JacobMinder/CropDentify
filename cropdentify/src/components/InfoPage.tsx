import React, { useEffect, useState } from 'react';
import './InfoPage.css'; // Import the CSS file for styling

// Import images from the ./corn folder
import image1 from './corn/image1.jpg';
import image2 from './corn/image2.jpg';
import image3 from './corn/image3.jpg';
import image4 from './corn/image4.jpg';
import image5 from './corn/image5.jpg';
import image6 from './corn/image6.jpg';

const InfoPage: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const cid = "QmS8eoDfMQiXgdp8EfXDhuWVHS1ZjznLKYBTv8BfXCAnYx"; // Replace with your actual CID

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/proxy?cid=${cid}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFiles(data); // Adjust based on actual data structure
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [cid]);

  if (loading) {
    return <div>Loading files...</div>;
  }

  // Array of imported images
  const images = [image1, image2, image3, image4, image5, image6];

  return (
    <div className="info-container">
      <h2 className="info-title">Information Page</h2>
      <p className="info-text">
        Welcome to the Info Page! Here you can find all your uploaded files.
      </p>
      <div className="file-cards">
        {files.map((file, index) => (
          <div key={index} className="file-card">
            <h3>{file.name}</h3>
            <p>File CID: {file.cid}</p>
            <a href={file.url} target="_blank" rel="noopener noreferrer">View File</a>
          </div>
        ))}
      </div>
      <div className="image-icons">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`icon-${index}`} className="image-icon" />
        ))}
      </div>
    </div>
  );
};

export default InfoPage;