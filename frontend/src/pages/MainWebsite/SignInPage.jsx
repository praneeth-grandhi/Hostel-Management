import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'

const SignInPage = () => {
  const [role, setRole] = useState('user') // 'user' or 'admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [adminType, setAdminType] = useState(null) // 'superadmin' or 'coadmin' (determined after login)
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!email.trim()) e.email = role === 'admin' ? 'Admin email is required' : 'Email is required'
    else if (role === 'user' && !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  // Demo function: Check if user is superadmin or coadmin (would come from backend)
  const checkAdminType = (email) => {
    // In a real app, backend would return the role based on database lookup
    // For demo, check if email exists in owners list (coadmin) or if it's a known super admin
    try {
      const ownersData = JSON.parse(localStorage.getItem('hostelManagement:owners') || '[]')
      const isCoAdmin = ownersData.some(owner => owner.email === email.toLowerCase())
      if (isCoAdmin) return 'coadmin'
    } catch (err) { /* ignore */ }
    
    // If not found in co-admins, assume super admin
    return 'superadmin'
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    setSuccess(false)

    // Admin login
    if (role === 'admin') {
      // Determine if super admin or co-admin
      const detectedAdminType = checkAdminType(email)
      setAdminType(detectedAdminType)
      
      setTimeout(() => {
        setLoading(false)
        setSuccess(true)
        try {
          localStorage.setItem(
            'hostelManagement:auth',
            JSON.stringify({ 
              role: detectedAdminType, // 'superadmin' or 'coadmin'
              authenticated: true, 
              at: new Date().toISOString() 
            })
          )
          // notify app about auth change so Navbar updates immediately
          window.dispatchEvent(new Event('hostelAuthChange'))
        } catch (e) { /* ignore storage errors */ }
        navigate('/adminDashboard')
      }, 400)
      return
    }

    // User role: demo flow - persist auth and navigate to public/home dashboard
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      try {
        localStorage.setItem(
          'hostelManagement:auth',
          JSON.stringify({ 
            role: 'guest', 
            authenticated: true, 
            email: email || '', 
            at: new Date().toISOString() 
          })
        )
        // notify app about auth change so Navbar updates immediately
        window.dispatchEvent(new Event('hostelAuthChange'))
      } catch (err) { /* ignore storage errors */ }
      // navigate to user area
      navigate('/')
    }, 400)
  }

  return (
    <div className="h-220 flex items-center justify-center bg-gray-50 p-5">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left: role-dependent visual panel */}
        <div
          className={`hidden md:flex flex-col justify-center p-10 text-white ${
            role === 'admin'
              ? 'bg-linear-to-br from-rose-600 to-pink-600'
              : 'bg-linear-to-br from-blue-600 to-indigo-700'
          }`}
        >
          {role === 'admin' ? (
            <>
              <h2 className="text-3xl font-bold mb-3">Welcome, Admin</h2>
              <p className="text-lg opacity-90 mb-6">
                Access your hostel dashboard — manage rooms, bookings and view earnings.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="font-semibold">•</span>
                  <span>Manage room listings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold">•</span>
                  <span>View and approve bookings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold">•</span>
                  <span>Generate reports & payouts</span>
                </li>
              </ul>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-3">Welcome Back</h2>
              <p className="text-lg opacity-90 mb-6">
                Sign in to manage your bookings, view invoices and personalized hostel recommendations.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="font-semibold">•</span>
                  <span>Fast check-in and booking history</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold">•</span>
                  <span>Secure payments and receipts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold">•</span>
                  <span>Exclusive offers for members</span>
                </li>
              </ul>
            </>
          )}
        </div>

        {/* Right: form panel */}
        <div className="p-8 md:p-12">
          {/* Role toggle */}
          <div className="mb-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                role === 'user'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
              aria-pressed={role === 'user'}
            >
              User
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                role === 'admin'
                  ? 'text-rose-600 font-semibold border-b-2 border-rose-600'
                  : 'text-gray-600'
              }`}
              aria-pressed={role === 'admin'}
            >
              Admin
            </button>
          </div>

          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            {role === 'admin' ? 'Admin Sign In' : 'Sign In'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {role === 'admin'
              ? 'Sign in with your admin email to access hostel controls.'
              : 'Sign in to manage bookings and view your hostel details.'}
          </p>

          {errors.general && (
            <div className="mb-4 p-3 text-sm text-red-800 bg-red-100 rounded">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                {role === 'admin' ? 'Admin Email' : 'Email'}
              </span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                placeholder={role === 'owner' ? 'owner@example.com or +9198...' : 'you@example.com'}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                placeholder="••••••••"
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center text-gray-600">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                <span className="ml-2">Remember me</span>
              </label>

              <Link to="/forgot" className="text-blue-600 hover:underline">
                Forgot?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-gray-600">
            {role === 'admin' ? (
              <>
                New admin?{' '}
                <Link to="/adminRegister" className="text-blue-600 hover:underline">
                  Register here
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
