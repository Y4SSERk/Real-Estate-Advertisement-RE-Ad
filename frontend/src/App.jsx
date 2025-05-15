import { useState, useEffect, use } from 'react';
import './App.css';

function App() {
  const [Property, setProperty] = useState([]);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/properties/');
      const data = await response.json();
      setProperty(data);
    }
    catch (error) {
      console.error('Error fetching property:', error);
    }
  }

  return (
    <>
      
    </>
  );
}

export default App;