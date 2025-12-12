import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'

const SignInPage = () => {
  const [role, setRole] = useState('user') // 'user' or 'admin'
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const checkAdminType = (email) => {
    try {
      const ownersData = JSON.parse(localStorage.getItem('hostelManagement:owners') || '[]')
      const isCoAdmin = ownersData.some(owner => owner.email === email.toLowerCase())
      if (isCoAdmin) return 'coadmin'
    } catch (err) {}
    return 'superadmin'
  }

  const onSubmit = async (data) => {
    if (role === 'admin') {
      const detectedAdminType = checkAdminType(data.email)

      await new Promise((resolve) => setTimeout(resolve, 400))

      try {
        localStorage.setItem(
          'hostelManagement:auth',
          JSON.stringify({
            role: detectedAdminType,
            authenticated: true,
            at: new Date().toISOString(),
          })
        )
        window.dispatchEvent(new Event('hostelAuthChange'))
      } catch (e) {}
      navigate('/adminDashboard')
      return
    }

    // User login
    await new Promise((resolve) => setTimeout(resolve, 400))

    try {
      localStorage.setItem(
        'hostelManagement:auth',
        JSON.stringify({
          role: 'guest',
          authenticated: true,
          email: data.email || '',
          at: new Date().toISOString(),
        })
      )
      window.dispatchEvent(new Event('hostelAuthChange'))
    } catch (err) {}
    reset()
    navigate('/')
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

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                {role === 'admin' ? 'Admin Email' : 'Email'}
              </span>
              <input
                type="email"
                placeholder={role === 'admin' ? 'admin@example.com' : 'you@example.com'}
                {...register('email', {
                  required: role === 'admin' ? 'Admin email is required' : 'Email is required',
                  ...(role === 'user' && {
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Enter a valid email',
                    },
                  }),
                })}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`mt-2 block w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                }`}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
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
