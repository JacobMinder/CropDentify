import React from 'react';
import './Header.css'; // Importing the CSS file

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="app-header">
      <h1 className="header-title">{title}</h1>
    </header>
  );
};

export default Header;
