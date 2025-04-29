import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';  // Install with: `npm install axios`

function App() {
  const [count, setCount] = useState(0);
  const [djangoMessage, setDjangoMessage] = useState('');

  // Fetch data from Django API
  useEffect(() => {
    axios.get('http://localhost:8000/api/hello/')
      .then(response => setDjangoMessage(response.data.message))
      .catch(error => console.error("Error fetching Django API:", error));
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Django</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        
        {/* Display Django API response */}
        <div style={{ marginTop: '20px', color: '#646cff' }}>
          <strong>Django API says:</strong> {djangoMessage || "Loading..."}
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;