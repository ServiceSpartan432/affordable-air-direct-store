import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { QuoteProvider } from './context/QuoteContext.jsx'
import { captureOppref, watchAdTaps } from './lib/adAttribution.js'
import './index.css'

// Before anything renders and before the router touches the location: the
// OpenAI click id lives on the landing URL only, and it is the one thing that
// ties a lead back to the ad that paid for it.
captureOppref()
// Phone taps are how this traffic actually converts — watch for them from the
// first paint, since the dialer can open before React has finished mounting.
watchAdTaps()

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
