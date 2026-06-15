import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Disable React DevTools hook in production builds to avoid
// errors from injected renderers with missing/invalid versions.
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  try {
    // Mark the global hook as disabled before React initializes.
    // Use defineProperty so we don't accidentally overwrite it in dev.
    Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
      value: { isDisabled: true },
      configurable: true,
    })
  } catch (e) {
    // ignore - defensive
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
