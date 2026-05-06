import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import './styles/globals.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('React root element #root was not found in index.html')
}

console.info('[main] React root found. Rendering app...')

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
