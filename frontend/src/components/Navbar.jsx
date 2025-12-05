import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  // hooks must run on every render — declare them first
  const [auth, setAuth] = useState(null) // { role, authenticated, email, name ... }
  const [open, setOpen] = useState(false)
  const ddRef = useRef(null)

  // effects also must run unconditionally
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem('hostelManagement:auth')
        setAuth(raw ? JSON.parse(raw) : null)
      } catch {
        setAuth(null)
      }
    }

    read()
    const onAuthChange = () => read()
    window.addEventListener('hostelAuthChange', onAuthChange)
    return () => window.removeEventListener('hostelAuthChange', onAuthChange)
  }, [])

  useEffect(() => {
    const onDown = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // only after hooks/effects, decide to early-return for admin routes
  const isAdminRoute = location.pathname.startsWith('/adminDashboard')
  if (isAdminRoute) return null

  const handleLogout = () => {
    try {
      localStorage.removeItem('hostelManagement:auth')
      window.dispatchEvent(new Event('hostelAuthChange'))
    } catch {}
    navigate('/signin')
  }

  // Owner/admin: clicking profile goes directly to admin dashboard
  if (auth && (auth.role === 'superadmin' || auth.role === 'coadmin')) {
    return (
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-1 rounded">
              <h1 className="text-white text-3xl font-semibold">Hostel Management</h1>
            </Link>
            <div className="hidden md:flex items-center gap-4 text-lg">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-1 rounded">Home</Link>
              <Link to="/about" className="text-gray-300 hover:text-white px-3 py-1 rounded">About</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/adminDashboard')}
              className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-1 rounded transition-colors"
              aria-label="Go to admin dashboard"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {(auth.name || auth.email || 'A').charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline">{auth.name || auth.email || 'Admin'}</span>
            </button>
          </div>
        </div>
      </nav>
    )
  }

  // Normal user: show profile + dropdown with user pages
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-300 hover:text-white px-3 py-1 rounded">
            <h1 className="text-white text-3xl font-semibold">Hostel Management</h1>
          </Link>
          <div className="hidden md:flex items-center gap-4 text-lg">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-1 rounded">Home</Link>
            <Link to="/about" className="text-gray-300 hover:text-white px-3 py-1 rounded">About</Link>
          </div>
        </div>

        <div className="flex items-center text-lg gap-3 relative" ref={ddRef}>
          {!auth ? (
            <>
              <Link to="/signin" className="text-gray-300 hover:text-white px-3 py-1 rounded transition-colors">Sign In</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors">Register</Link>
            </>
          ) : (
            <>
              <button
                onClick={() => setOpen((s) => !s)}
                className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-1 rounded transition-colors"
                aria-expanded={open}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {(auth.name || auth.email || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline">{auth.name || auth.email || 'User'}</span>

                <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z" clipRule="evenodd" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-60 w-56 bg-white rounded-md shadow-lg border overflow-hidden z-40">
                  <Link to="/userDashboard/profileSettings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                  <Link to="/userDashboard/pastBookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Past bookings</Link>
                  <Link to="/userDashboard/book" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Book a hostel</Link>
                  <Link to="/userDashboard/myHostel" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My hostel</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
