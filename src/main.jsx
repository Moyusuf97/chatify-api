import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './components/chat.jsx'
import './components/login.jsx'
import './components/register.jsx'
import './components/sidenav.jsx'
import fetchCsrfToken from './components/csrfToken.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
