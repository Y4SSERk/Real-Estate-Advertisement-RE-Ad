import React from 'react';

function SimpleApp() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Simple React App</h1>
      <p>This is a minimal React component to test rendering.</p>
      <div style={{ 
        margin: '20px auto',
        padding: '15px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px',
        maxWidth: '500px'
      }}>
        <p>If you can see this box, React is rendering correctly!</p>
      </div>
    </div>
  );
}

export default SimpleApp;
