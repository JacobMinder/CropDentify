import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  title: string;
  stopCamera: () => void; // Accept stopCamera function as a prop
}

const Header: React.FC<HeaderProps> = ({ title, stopCamera }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const togglePage = () => {
    // Stop the camera before switching pages
    stopCamera();

    if (location.pathname === '/') {
      navigate('/info'); // aNavigate to info page
    } else {
      navigate('/'); // Navigate back to home page
    }
  };

  return (
    <header className="app-header">
      <h1 className="header-title">{title}</h1>
      <button onClick={togglePage} className="nav-button">
        {location.pathname === '/' ? 'Go to Info Page' : 'Go to Home Page'}
      </button>
    </header>
  );
};

export default Header;
