import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import HostelRegistrationForm from '../../components/HostelRegistrationForm'

const AdminRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      // Admin/User fields only
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      country_code: '',
      address: '',
      country: '',
      city: '',
      state: '',
      zip_code: '',
      password: '',
      confirm_password: '',
      agree: false,
    },
  })

  // Files / documents
  const [profilePicture, setProfilePicture] = useState(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState('')
  const [aadharFile, setAadharFile] = useState(null)
  const [panFile, setPanFile] = useState(null)

  const [errorMessage, setErrorMessage] = useState('')
  const [step, setStep] = useState('form') // 'form' | 'otp' | 'hostel' | 'post'
  const [otp, setOtp] = useState('')
  const [registrationData, setRegistrationData] = useState(null)

  const password = watch('password')
  const agree = watch('agree')

  const passwordStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1
    return score
  }

  useEffect(() => {
    return () => {
      if (profilePicturePreview) URL.revokeObjectURL(profilePicturePreview)
    }
  }, [])

  const handleProfilePictureChange = (file) => {
    if (!file) {
      setProfilePicture(null)
      setProfilePicturePreview('')
      return
    }
    setProfilePicture(file)
    const url = URL.createObjectURL(file)
    setProfilePicturePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
  }

  const onSubmit = async (data) => {
    setErrorMessage('')
    try {
      // Admin registration data only
      const payload = {
        ...data,
        role: 'admin', // Force role to admin
      }

      console.log('Submitting admin registration:', payload)

      // TODO: Call API endpoint that creates User account
      // const result = await REGISTER_ADMIN(payload)

      setRegistrationData(payload)
      setStep('otp')
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed')
    }
  }

  const handleVerifyOtp = (ev) => {
    ev.preventDefault()
    // Move to hostel registration after OTP verification
    setStep('hostel')
  }

  const handleHostelSubmit = (hostelData) => {
    // Combine admin and hostel data
    const combinedData = {
      ...registrationData,
      hostel: hostelData,
    }
    setRegistrationData(combinedData)
    setStep('post')
  }

  const handleBackFromHostel = () => {
    setStep('otp')
  }

  return (
    <div className="container mx-auto p-6">
      {/* FORM STEP */}
      {step === 'form' && (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Admin / Owner Account</h1>
            <p className="text-sm text-gray-600 mb-6">
              Register as admin/owner. You can add your first hostel after verification.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* ========== ADMIN/OWNER SECTION ========== */}
              <div className="border-b pb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Information *</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">First name *</span>
                    <input
                      type="text"
                      placeholder="John"
                      {...register('first_name', { required: 'First name is required' })}
                      className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                        errors.first_name ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>}
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Last name *</span>
                    <input
                      type="text"
                      placeholder="Doe"
                      {...register('last_name', { required: 'Last name is required' })}
                      className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                        errors.last_name ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>}
                  </label>
                </div>

                <label className="block mt-4">
                  <span className="text-sm font-medium text-gray-700">Email *</span>
                  <input
                    type="email"
                    placeholder="owner@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                    })}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.email ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Country code *</span>
                    <input
                      type="text"
                      placeholder="+91"
                      {...register('country_code', { required: 'Country code is required' })}
                      className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                        errors.country_code ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.country_code && <p className="mt-1 text-xs text-red-600">{errors.country_code.message}</p>}
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Phone number *</span>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...register('phone_number', {
                        required: 'Phone number is required',
                        validate: (value) => {
                          const digitsOnly = value.replace(/\D/g, '')
                          return digitsOnly.length >= 7 || 'Phone must have at least 7 digits'
                        },
                      })}
                      className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                        errors.phone_number ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.phone_number && <p className="mt-1 text-xs text-red-600">{errors.phone_number.message}</p>}
                  </label>
                </div>

                <label className="block mt-4">
                  <span className="text-sm font-medium text-gray-700">Address *</span>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    {...register('address', { required: 'Address is required' })}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.address ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
                </label>

                <label className="block mt-4">
                  <span className="text-sm font-medium text-gray-700">Country *</span>
                  <input
                    type="text"
                    placeholder="United States"
                    {...register('country', { required: 'Country is required' })}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.country ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>}
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">City *</span>
                    <input
                      type="text"
                      placeholder="New York"
                      {...register('city', { required: 'City is required' })}
                      className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                        errors.city ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">State *</span>
                    <input
                      type="text"
                      placeholder="NY"
                      {...register('state', { required: 'State is required' })}
                      className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                        errors.state ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Zip Code *</span>
                    <input
                      type="text"
                      placeholder="10001"
                      {...register('zip_code', { required: 'Zip code is required' })}
                      className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                        errors.zip_code ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.zip_code && <p className="mt-1 text-xs text-red-600">{errors.zip_code.message}</p>}
                  </label>
                </div>
              </div>

              {/* ========== PASSWORD & AGREEMENTS ========== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Password *</span>
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    })}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.password ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  <div className="mt-2 h-2 w-full bg-gray-100 rounded">
                    <div
                      className={`h-2 rounded ${
                        {
                          0: 'w-0 bg-red-400',
                          1: 'w-1/4 bg-red-400',
                          2: 'w-2/4 bg-yellow-400',
                          3: 'w-3/4 bg-green-400',
                          4: 'w-full bg-green-600',
                        }[passwordStrength(password)]
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Use a mix of letters, numbers and symbols.</p>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Confirm password *</span>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    {...register('confirm_password', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.confirm_password ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.confirm_password && <p className="mt-1 text-xs text-red-600">{errors.confirm_password.message}</p>}
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="agree"
                  type="checkbox"
                  {...register('agree', { required: 'You must accept Terms & Privacy' })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="agree" className="text-sm text-gray-700">
                  I'm registering as an admin/owner and agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>{' '}
                  *
                </label>
              </div>
              {errors.agree && <p className="text-xs text-red-600">{errors.agree.message}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg text-white font-medium ${
                  isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>

              <div className="text-sm text-center text-gray-600">
                Already registered?{' '}
                <Link to="/signin" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP STEP */}
      {step === 'otp' && (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Verify phone (OTP)</h2>
          <p className="text-sm text-gray-600 mb-4">Enter the OTP sent to your mobile. (demo accepts any value)</p>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter OTP"
            />
            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg">
                Verify
              </button>
              <button
                type="button"
                onClick={() => {
                  setOtp('')
                }}
                className="py-3 px-4 border rounded-lg"
              >
                Resend
              </button>
            </div>
          </form>
        </div>
      )}

      {/* HOSTEL REGISTRATION STEP */}
      {step === 'hostel' && registrationData && (
        <HostelRegistrationForm
          adminData={registrationData}
          onSubmitSuccess={handleHostelSubmit}
          onBack={handleBackFromHostel}
        />
      )}

      {/* POST-REGISTRATION: Success message */}
      {step === 'post' && registrationData && (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center">
              <div className="text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
              <p className="text-gray-600 mb-6">Your admin account and hostel have been registered successfully.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Admin Summary */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Admin Account</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div>
                    <span className="font-medium">Name:</span> {registrationData.first_name} {registrationData.last_name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {registrationData.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {registrationData.country_code} {registrationData.phone_number}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {registrationData.city}, {registrationData.state}, {registrationData.country}
                  </div>
                </div>
              </div>

              {/* Hostel Summary */}
              {registrationData.hostel && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3">Hostel Details</h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <div>
                      <span className="font-medium">Name:</span> {registrationData.hostel.hostel_name}
                    </div>
                    <div>
                      <span className="font-medium">Address:</span> {registrationData.hostel.hostel_address}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {registrationData.hostel.hostel_city}, {registrationData.hostel.hostel_state},{registrationData.hostel.hostel_country}
                    </div>
                    <div>
                      <span className="font-medium">Rooms:</span> {registrationData.hostel.total_rooms}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-2">Next Steps</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Check your email for account confirmation</li>
                <li>• Your hostel will be verified by our team within 24-48 hours</li>
                <li>• You will receive an email once your hostel is verified</li>
                <li>• After verification, you can manage bookings and rooms in your dashboard</li>
              </ul>
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                to="/signin"
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700"
              >
                Go to Sign In
              </Link>
              <Link to="/" className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium text-center hover:bg-gray-50">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminRegister
