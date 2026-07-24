import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import StoreHome from './pages/StoreHome.jsx'
import Question from './pages/journey/Question.jsx'
import Contact from './pages/journey/Contact.jsx'
import Results from './pages/journey/Results.jsx'
import Cart from './pages/Cart.jsx'
import Search from './pages/Search.jsx'

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname, search])
  return null
}

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<StoreHome />} />
        {/* fixed journey endpoints must precede the :stepId catch-all */}
        <Route path="/journey/contact" element={<Contact />} />
        <Route path="/journey/results" element={<Results />} />
        <Route path="/journey/:stepId" element={<Question />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
