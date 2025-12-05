import React, { useState } from 'react'
import { Link } from 'react-router'

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [address, setAddress] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
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
    if (!phone.trim()) e.phone = 'Phone number is required'
    else if (!/^[0-9]{7,15}$/.test(phone.replace(/\D/g, ''))) e.phone = 'Enter a valid phone number'
    if (!countryCode.trim()) e.countryCode = 'Country code is required'
    if (!address.trim()) e.address = 'Address is required'
    if (!country.trim()) e.country = 'Country is required'
    if (!city.trim()) e.city = 'City is required'
    if (!state.trim()) e.state = 'State is required'
    if (!zipCode.trim()) e.zipCode = 'Zip code is required'
    if (!password) e.password = 'Password is required'
    else if (password.length < 8) e.password = 'Password must be at least 8 characters'
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
      setPhone('')
      setCountryCode('')
      setAddress('')
      setCountry('')
      setCity('')
      setState('')
      setZipCode('')
      setPassword('')
      setConfirmPassword('')
      console.log('Registered:', { firstName, lastName, email, phone, countryCode, address, country, city, state, zipCode })
    }, 900)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-5xl h-[600px] grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl shadow-lg overflow-hidden">
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
        <div className="p-8 md:p-12 overflow-y-auto">
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

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Country Code</span>
              <input
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.countryCode ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                placeholder="+91"
                aria-invalid={errors.countryCode ? 'true' : 'false'}
              />
              {errors.countryCode && <p className="mt-1 text-xs text-red-600">{errors.countryCode}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Phone Number</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                placeholder="+91 1234567890"
                aria-invalid={errors.phone ? 'true' : 'false'}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Address</span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.address ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                placeholder="123 Main Street"
                aria-invalid={errors.address ? 'true' : 'false'}
              />
              {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Country</span>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.country ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                placeholder="United States"
                aria-invalid={errors.country ? 'true' : 'false'}
              />
              {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">City</span>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.city ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  placeholder="New York"
                  aria-invalid={errors.city ? 'true' : 'false'}
                />
                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">State</span>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.state ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  placeholder="NY"
                  aria-invalid={errors.state ? 'true' : 'false'}
                />
                {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Zip Code</span>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.zipCode ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  placeholder="10001"
                  aria-invalid={errors.zipCode ? 'true' : 'false'}
                />
                {errors.zipCode && <p className="mt-1 text-xs text-red-600">{errors.zipCode}</p>}
              </label>
            </div>

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
        </div>
      </div>
      
      {/* Hostel owner registration link - centered below form */}
      <div className='flex items-center justify-center mt-8 text-center'>
        <span className='text-gray-600'>Want to register or join as a hostel owner?&nbsp;</span>
        <Link to="/register/adminregister" className="text-blue-600 hover:underline font-medium">
          Register
        </Link> 
      </div>
    </div>
  )
}

export default RegisterPage
