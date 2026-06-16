import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Disable React DevTools hook in production builds to avoid
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  try {
    // Mark the global hook as disabled before React initializes.
    Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
      value: { isDisabled: true },
      configurable: true,
    })
  } catch {
    // Ignore errors from defining the property, which can occur in some environments.
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
