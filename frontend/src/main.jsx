import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import FontAwesome for icons
import '@fortawesome/fontawesome-free/css/all.min.css'

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
