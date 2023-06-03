import React from 'react';

const TextBold = ({text}) => {
  return (
    <span style={textStyle}>{text}</span>
  );
};

const textStyle = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: '800',
  fontSize: 32,
};

export default TextBold;
