import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Simple test component to verify rendering
function TestApp() {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#4CAF50' }}>React App Test</h1>
      <p>If you can see this, React is rendering correctly!</p>
      
      <div style={{ 
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #ddd'
      }}>
        <h2>Troubleshooting Complete</h2>
        <p>Your React environment is working. Now we can restore your original application.</p>
      </div>
    </div>
  )
}

// Mount the app to the DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
)
