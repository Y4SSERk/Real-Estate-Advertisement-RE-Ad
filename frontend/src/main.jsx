import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Lazy load FontAwesome for better performance
// This will load the CSS asynchronously after the page loads
const loadFontAwesome = () => {
  const link = document.createElement('link')
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
}

// Load FontAwesome after the initial render
setTimeout(loadFontAwesome, 100)

// Create root element if it doesn't exist
let rootElement = document.getElementById('root')
if (!rootElement) {
  rootElement = document.createElement('div')
  rootElement.id = 'root'
  document.body.appendChild(rootElement)
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
