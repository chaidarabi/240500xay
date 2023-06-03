import React from 'react';

const TextRegular = ({text, fs = 20}) => {
  return (
    <span style={{textStyle, fontSize: fs }}>{text}</span>
  );
};

const textStyle = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: '500',
};

export default TextRegular;
