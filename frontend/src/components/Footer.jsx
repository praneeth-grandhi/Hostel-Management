import React from 'react'
import { Link, useLocation } from 'react-router'

const Footer = () => {
  const location = useLocation()
  // hide footer on user or admin sections
  const hide = location.pathname.startsWith('/userDashboard') || location.pathname.startsWith('/adminDashboard')
  if (hide) return null

  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between md:items-start gap-8">
          <div className="mb-6 md:mb-0">
            <h3 className="text-white text-xl font-semibold">Hostel Management</h3>
            <p className="text-sm text-gray-400 mt-2 max-w-sm">
              Manage bookings, hostels and users easily. Built for small hostels and PG owners.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1">
            <div>
              <h4 className="text-gray-200 font-medium mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/services" className="hover:text-white">Services</Link></li>
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-200 font-medium mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-200 font-medium mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-200 font-medium mb-3">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/signin" className="hover:text-white">Sign in</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
                <li><a href="mailto:support@hostel.example" className="hover:text-white">support@hostel.example</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Hostel Management. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.03 3.66 9.2 8.44 9.93v-7.03H8.07v-2.9h2.37V9.41c0-2.34 1.39-3.62 3.52-3.62 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.46v1.74h2.59l-.41 2.9h-2.18V22C18.34 21.27 22 17.1 22 12.07z" /></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M22 5.92c-.63.28-1.3.46-2 .55.72-.43 1.27-1.1 1.53-1.9-.68.4-1.44.69-2.25.85A3.6 3.6 0 0015.5 4c-1.98 0-3.58 1.6-3.58 3.58 0 .28.03.55.09.81C8.1 8.2 5.1 6.5 3.1 4.02c-.31.53-.49 1.14-.49 1.79 0 1.24.63 2.34 1.59 2.98-.59-.02-1.14-.18-1.62-.45v.05c0 1.73 1.23 3.18 2.86 3.51-.3.08-.62.13-.95.13-.23 0-.46-.02-.68-.06.46 1.43 1.79 2.47 3.36 2.5A7.22 7.22 0 012 19.54a10.17 10.17 0 005.5 1.62c6.6 0 10.21-5.47 10.21-10.21v-.47c.7-.5 1.3-1.12 1.78-1.83-.65.29-1.35.48-2.08.56z" /></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 1016.5 13 4.5 4.5 0 0012 8.5zm6.5-3.75a1.25 1.25 0 11-1.25 1.25A1.25 1.25 0 0118.5 4.75z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
