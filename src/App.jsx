import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { initPixel, trackPageView } from './lib/tracking.js'
import Layout from './components/Layout.jsx'
import StoreHome from './pages/StoreHome.jsx'
import Question from './pages/journey/Question.jsx'
import Contact from './pages/journey/Contact.jsx'
import Results from './pages/journey/Results.jsx'
import Cart from './pages/Cart.jsx'
import Search from './pages/Search.jsx'
import Services from './pages/site/Services.jsx'
import About from './pages/site/About.jsx'
import Reviews from './pages/site/Reviews.jsx'
import Faq from './pages/site/Faq.jsx'
import ContactPage from './pages/site/Contact.jsx'
import Privacy from './pages/site/Privacy.jsx'

function ScrollToTop() {
  const { pathname, search } = useLocation()
  // block body: guarantees no accidental non-function return value reaches
  // React as a useEffect "cleanup" (window.scrollTo's return isn't guaranteed
  // undefined in every environment/polyfill).
  useEffect(() => { window.scrollTo(0, 0) }, [pathname, search])
  return null
}

// Meta Pixel init once + a PageView on every route change.
function PageTracker() {
  const { pathname } = useLocation()
  useEffect(() => { initPixel() }, [])
  useEffect(() => { trackPageView() }, [pathname])
  return null
}

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <PageTracker />
      <Routes>
        <Route path="/" element={<StoreHome />} />
        {/* funnel — fixed endpoints must precede the :stepId catch-all */}
        <Route path="/journey/contact" element={<Contact />} />
        <Route path="/journey/results" element={<Results />} />
        <Route path="/journey/:stepId" element={<Question />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        {/* site pages */}
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<Privacy />} />
        {/* legacy WordPress paths — keep old links + indexed URLs working */}
        <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
        <Route path="/store" element={<Navigate to="/journey/system_type" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
