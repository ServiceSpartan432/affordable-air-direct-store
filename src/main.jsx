import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { QuoteProvider } from './context/QuoteContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <QuoteProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </QuoteProvider>
    </HashRouter>
  </React.StrictMode>,
)
