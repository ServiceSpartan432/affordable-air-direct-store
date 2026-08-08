import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { isDemoMode } from '../lib/demoMode.js'

export default function Layout({ children }) {
  const demo = isDemoMode()
  return (
    <div className="flex min-h-screen flex-col">
      {demo && (
        <div className="sticky top-0 z-50 bg-amber-400 px-4 py-1.5 text-center text-xs font-bold text-amber-950">
          🧪 DEMO MODE — no emails are sent and no tracking events fire. Safe to click through.
        </div>
      )}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
