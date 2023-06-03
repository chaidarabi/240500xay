import React from 'react';

const Header = () => {
  return (
    <header style={headerStyle}>
      <img src="https://rumahsiapkerja.com/img/logo-navbar.3f23e18c.svg" alt="Logo" style={logoStyle} />
    </header>
  );
};

const headerStyle = {
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  padding: '20px',
};

const logoStyle = {
  height: '40px',
  width: 'auto',
};

export default Header;
