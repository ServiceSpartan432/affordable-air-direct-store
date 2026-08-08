import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { QuoteProvider } from './context/QuoteContext.jsx'
import './index.css'

// Clean URLs (no #). basename follows the Vite base so the GH Pages demo
// (subpath) and the root-domain production build both work.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

// One-time migration: redirect old #/path links (bookmarks, ads) to clean URLs.
if (window.location.hash.startsWith('#/')) {
  const clean = basename + window.location.hash.slice(1)
  window.history.replaceState(null, '', clean)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <QuoteProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </QuoteProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
