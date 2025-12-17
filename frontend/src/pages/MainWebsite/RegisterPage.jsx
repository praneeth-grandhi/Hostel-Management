import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { REGISTER_USER } from '../../Data/request'

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      address: '',
      country_code: '',
      country: '',
      city: '',
      state: '',
      zip_code: '',
      password: '',
      confirm_password: '',
      role: 'user',
    },
  })

  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const password = watch('password')

  const onSubmit = async (data) => {
    setSuccess(false)
    setErrorMessage('')

    try {
      const result = await REGISTER_USER(data)
      setSuccess(true)
      reset()
      console.log('Registered successfully:', result)
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'Registration failed. Please try again.')
      console.error('Registration error:', error)
    }
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
              Account created successfully!
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 text-sm text-red-800 bg-red-100 rounded">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">First Name</span>
                <input
                  type="text"
                  placeholder="Your first name"
                  {...register('first_name', {
                    required: 'First name is required',
                  })}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.first_name ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  aria-invalid={errors.first_name ? 'true' : 'false'}
                />
                {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Last Name</span>
                <input
                  type="text"
                  placeholder="Your last name"
                  {...register('last_name', {
                    required: 'Last name is required',
                  })}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.last_name ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  aria-invalid={errors.last_name ? 'true' : 'false'}
                />
                {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>}
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Enter a valid email',
                  },
                })}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Country Code</span>
              <input
                type="text"
                placeholder="+91"
                {...register('country_code', {
                  required: 'Country code is required',
                })}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.country_code ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                aria-invalid={errors.country_code ? 'true' : 'false'}
              />
              {errors.country_code && <p className="mt-1 text-xs text-red-600">{errors.country_code.message}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Phone Number</span>
              <input
                type="tel"
                placeholder="+91 1234567890"
                {...register('phone_number', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{7,15}$/,
                    message: 'Enter a valid phone number (7-15 digits)',
                  },
                  validate: (value) => {
                    const digitsOnly = value.replace(/\D/g, '')
                    return digitsOnly.length >= 7 || 'Phone must have at least 7 digits'
                  },
                })}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.phone_number ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                aria-invalid={errors.phone_number ? 'true' : 'false'}
              />
              {errors.phone_number && <p className="mt-1 text-xs text-red-600">{errors.phone_number.message}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Address</span>
              <input
                type="text"
                placeholder="123 Main Street"
                {...register('address', {
                  required: 'Address is required',
                })}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.address ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                aria-invalid={errors.address ? 'true' : 'false'}
              />
              {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Country</span>
              <input
                type="text"
                placeholder="United States"
                {...register('country', {
                  required: 'Country is required',
                })}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.country ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                aria-invalid={errors.country ? 'true' : 'false'}
              />
              {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">City</span>
                <input
                  type="text"
                  placeholder="New York"
                  {...register('city', {
                    required: 'City is required',
                  })}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.city ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  aria-invalid={errors.city ? 'true' : 'false'}
                />
                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">State</span>
                <input
                  type="text"
                  placeholder="NY"
                  {...register('state', {
                    required: 'State is required',
                  })}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.state ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  aria-invalid={errors.state ? 'true' : 'false'}
                />
                {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Zip Code</span>
                <input
                  type="text"
                  placeholder="10001"
                  {...register('zip_code', {
                    required: 'Zip code is required',
                  })}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.zip_code ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  aria-invalid={errors.zip_code ? 'true' : 'false'}
                />
                {errors.zip_code && <p className="mt-1 text-xs text-red-600">{errors.zip_code.message}</p>}
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Password</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.password ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Confirm Password</span>
                <input
                  type="password"
                  placeholder="Confirm password"
                  {...register('confirm_password', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors.confirm_password ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  aria-invalid={errors.confirm_password ? 'true' : 'false'}
                />
                {errors.confirm_password && <p className="mt-1 text-xs text-red-600">{errors.confirm_password.message}</p>}
              </label>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Register'}
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
