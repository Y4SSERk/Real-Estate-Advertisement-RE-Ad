import React from 'react';

function TestApp() {
  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#4CAF50' }}>React Test Page</h1>
      <p>If you can see this page, React is rendering correctly!</p>
      
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Troubleshooting Information</h2>
        <p>React version: {React.version}</p>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
      </div>
      
      <button 
        onClick={() => alert('Button clicked! JavaScript is working.')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Click Me to Test JavaScript
      </button>
    </div>
  );
}

export default TestApp;
