import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [auth, setAuth] = useState(null)
  const [open, setOpen] = useState(false)
  const ddRef = useRef(null)

  // Read auth from localStorage
  useEffect(() => {
    const readAuth = () => {
      try {
        const raw = localStorage.getItem('hostelManagement:auth')
        setAuth(raw ? JSON.parse(raw) : null)
      } catch {
        setAuth(null)
      }
    }
    readAuth()
    window.addEventListener('hostelAuthChange', readAuth)
    return () => window.removeEventListener('hostelAuthChange', readAuth)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Hide navbar on admin dashboard
  if (location.pathname.startsWith('/adminDashboard')) return null

  const handleLogout = () => {
    localStorage.removeItem('hostelManagement:auth')
    window.dispatchEvent(new Event('hostelAuthChange'))
    navigate('/signin')
  }

  const isAdminOrCoAdmin = auth?.role === 'admin' || auth?.role === 'coadmin'
  const displayName = auth?.name || auth?.email || 'User'
  const initial = displayName.charAt(0).toUpperCase()
  // Admin/CoAdmin navbar - profile click goes to admin dashboard
  if (auth && isAdminOrCoAdmin) {
    return (
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-white text-3xl font-semibold hover:opacity-90">
              Hostel Management
            </Link>
            <div className="hidden md:flex items-center gap-4 text-lg">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-1">Home</Link>
              <Link to="/about" className="text-gray-300 hover:text-white px-3 py-1">About</Link>
            </div>
          </div>

          <button
            onClick={() => navigate('/adminDashboard')}
            className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-1 rounded"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              {initial}
            </div>
            <span className="hidden md:inline">{displayName}</span>
          </button>
        </div>
      </nav>
    )
  }

  // Regular user or guest navbar
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-white text-4xl font-semibold hover:opacity-90">
            StayGhar
          </Link>
          <div className="hidden md:flex items-center gap-4 text-lg">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-1">Home</Link>
            <Link to="/about" className="text-gray-300 hover:text-white px-3 py-1">About</Link>
          </div>
        </div>

        <div className="flex items-center text-lg gap-3 relative" ref={ddRef}>
          {!auth ? (
            <>
              <Link to="/signin" className="text-gray-300 hover:text-white px-3 py-1">Sign In</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Register</Link>
            </>
          ) : (
            <>
              <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-1"
                aria-expanded={open}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {initial}
                </div>
                <span className="hidden md:inline">{displayName}</span>
                <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z" clipRule="evenodd" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                  <Link to="/userDashboard/profileSettings" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                  <Link to="/userDashboard/pastBookings" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Past Bookings</Link>
                  <Link to="/userDashboard/myHostel" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Hostel</Link>
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

export default Navbar
