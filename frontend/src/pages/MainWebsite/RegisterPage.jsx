import React, { useState } from 'react'
import { Link } from 'react-router'

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!firstName.trim()) e.firstName = 'First name is required'
    if (!lastName.trim()) e.lastName = 'Last name is required'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    setSuccess(false)
    // replace with real registration API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      // reset form if desired:
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      console.log('Registered:', { firstName, lastName, email })
    }, 900)
  }

  return (
    <div className="h-220 flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left info / marketing panel */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-linear-to-br from-teal-600 to-green-600 text-white">
          <h2 className="text-3xl font-bold mb-3">Create your account</h2>
          <p className="text-lg opacity-90 mb-6">
            Join now to book rooms, get member offers and manage your hostel profile easily.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="font-semibold">•</span>
              <span>Quick bookings</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold">•</span>
              <span>Secure payments</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold">•</span>
              <span>Exclusive discounts</span>
            </li>
          </ul>
        </div>

        {/* Right: registration form */}
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Create Account</h1>
          <p className="text-sm text-gray-500 mb-6">Register to book rooms and manage your hostel profile.</p>

          {success && (
            <div className="mb-4 p-3 text-sm text-green-800 bg-green-100 rounded">
              Account created successfully (demo).
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">First Name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.firstName ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  placeholder="Your first name"
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Last Name</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.lastName ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  placeholder="Your last name"
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                placeholder="you@example.com"
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Confirm Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.confirmPassword ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  placeholder="Confirm password"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
              </label>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
          <div className='flex items-center text-center justify-center mt-5'> Want to register or join as a hostel owner?
            <Link to="/register/adminregister" className="text-blue-600 hover:underline px-2">
              Register
            </Link> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
