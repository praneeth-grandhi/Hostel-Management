import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { LOGIN_USER } from '../../Data/request'

const SignInPage = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

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

  const onSubmit = async (data) => {
    setErrorMessage('')
    
    try {
      // Call backend login API
      const response = await LOGIN_USER({
        username: data.email,
        password: data.password,
      })

      console.log('Login response:', response)

      // Store auth data including tokens and role
      const authData = {
        authenticated: true,
        role: response.user?.role || 'user',
        email: data.email,
        access: response.access,
        refresh: response.refresh,
        at: new Date().toISOString(),
      }
      
      localStorage.setItem('hostelManagement:auth', JSON.stringify(authData))
      window.dispatchEvent(new Event('hostelAuthChange'))

      reset()

      // Redirect based on role from backend
      if (response.user?.role === 'admin') {
        navigate('/adminDashboard')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      const message = error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        'Invalid email or password. Please try again.'
      setErrorMessage(message)
    }
  }

  useEffect(() => {
    try{
      const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
      if (auth && auth.authenticated) {
        if(auth.role === 'admin'){
          navigate('/adminDashboard')
        } else {
          navigate('/')
        }
      }
    }
    catch (error){

    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-5">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left: visual panel */}
        <div className="hidden md:flex flex-col justify-center p-10 text-white bg-linear-to-br from-blue-600 to-indigo-700">
          <h2 className="text-3xl font-bold mb-3">Welcome Back</h2>
          <p className="text-lg opacity-90 mb-6">
            Sign in to access your account — whether you're a guest or hostel admin.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="font-semibold">•</span>
              <span>Manage your bookings and reservations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold">•</span>
              <span>Access your hostel dashboard (admins)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold">•</span>
              <span>Secure payments and receipts</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold">•</span>
              <span>View booking history and invoices</span>
            </li>
          </ul>
        </div>

        {/* Right: form panel */}
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Sign In</h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter your email and password to access your account.
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 text-sm text-red-800 bg-red-100 rounded">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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
            Don't have an account? Register as {' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              User
            </Link>
            {' or '}
            <Link to="/register/adminregister" className="text-blue-600 hover:underline">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
